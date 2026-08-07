#!/usr/bin/env python3
"""
Fetch real cover artwork for the AI & Civilization syllabus readings.

Readings that still point at a generated placeholder
(/images/syllabus/<slug>.svg) are looked up on Open Library, the cover is
downloaded to /public/images/books/<slug>.jpg, and app/data/syllabus.ts is
rewritten to point at the downloaded file. Readings that already have real
artwork are left alone, as are the essay/interview entries that have no
printed cover.

This must be run somewhere with open network access — the hosted Claude Code
sandbox blocks openlibrary.org, covers.openlibrary.org and every other cover
CDN at the egress proxy.

Usage:
    python3 scripts/fetch_syllabus_covers.py            # fetch what's missing
    python3 scripts/fetch_syllabus_covers.py --force    # re-fetch everything
    python3 scripts/fetch_syllabus_covers.py --dry-run  # show what it would do

Optional: set GOOGLE_BOOKS_API_KEY to enable the Google Books fallback for
titles Open Library has no cover for.
"""

import argparse
import json
import os
import re
import ssl
import sys
import time
import urllib.parse
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_FILE = os.path.join(ROOT, "app", "data", "syllabus.ts")
COVER_DIR = os.path.join(ROOT, "public", "images", "books")

USER_AGENT = "lucas-cv-syllabus-covers/1.0 (https://lucasdickey.com)"
MIN_COVER_BYTES = 3000  # Open Library serves a ~800 byte blank when it has none


def ssl_context():
    """A verified TLS context. Framework Python on macOS ships without a usable
    trust store, so fall back to certifi and then the system bundle."""
    try:
        import certifi

        return ssl.create_default_context(cafile=certifi.where())
    except ImportError:
        pass
    for bundle in ("/etc/ssl/cert.pem", "/usr/local/etc/openssl/cert.pem"):
        if os.path.exists(bundle):
            return ssl.create_default_context(cafile=bundle)
    return ssl.create_default_context()


CONTEXT = ssl_context()


def get(url, binary=False, timeout=30):
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=timeout, context=CONTEXT) as response:
        payload = response.read()
    return payload if binary else json.loads(payload.decode("utf-8"))


def parse_readings(source):
    """Pull slug/title/author/format/coverUrl out of the syllabus data file."""
    readings = []
    for block in re.findall(r"\{\s*slug: \"[\s\S]*?\n      \}", source):
        def field(name):
            match = re.search(rf'{name}: "([^"]*)"', block)
            return match.group(1) if match else None

        readings.append(
            {
                "slug": field("slug"),
                "title": field("title"),
                "author": field("author"),
                "format": field("format"),
                "coverUrl": field("coverUrl"),
            }
        )
    return readings


def openlibrary_cover_url(title, author):
    """Best-matching Open Library cover URL for a title, or None."""
    query = urllib.parse.urlencode(
        {
            "title": title,
            "author": author,
            "limit": 5,
            "fields": "title,author_name,cover_i,isbn,first_publish_year",
        }
    )
    try:
        results = get(f"https://openlibrary.org/search.json?{query}")
    except Exception as error:  # noqa: BLE001 - report and continue
        print(f"    open library search failed: {error}")
        return None

    for doc in results.get("docs", []):
        if doc.get("cover_i"):
            return f"https://covers.openlibrary.org/b/id/{doc['cover_i']}-L.jpg"
    for doc in results.get("docs", []):
        for isbn in doc.get("isbn", [])[:3]:
            return f"https://covers.openlibrary.org/b/isbn/{isbn}-L.jpg?default=false"
    return None


def google_books_cover_url(title, author):
    """Google Books fallback. Requires GOOGLE_BOOKS_API_KEY to be set."""
    key = os.environ.get("GOOGLE_BOOKS_API_KEY")
    if not key:
        return None
    query = urllib.parse.urlencode(
        {
            "q": f'intitle:"{title}" inauthor:"{author}"',
            "maxResults": 5,
            "key": key,
        }
    )
    try:
        results = get(f"https://www.googleapis.com/books/v1/volumes?{query}")
    except Exception as error:  # noqa: BLE001
        print(f"    google books search failed: {error}")
        return None

    for item in results.get("items", []):
        links = item.get("volumeInfo", {}).get("imageLinks", {})
        url = links.get("extraLarge") or links.get("large") or links.get("thumbnail")
        if url:
            # Ask for a bigger render than the default thumbnail crop.
            return url.replace("&edge=curl", "").replace("zoom=1", "zoom=3")
    return None


def download_cover(url, destination, dry_run):
    if dry_run:
        print(f"    would download {url}")
        return True
    try:
        payload = get(url, binary=True)
    except Exception as error:  # noqa: BLE001
        print(f"    download failed: {error}")
        return False

    if len(payload) < MIN_COVER_BYTES:
        print(f"    skipped: {len(payload)} bytes is a blank placeholder, not a cover")
        return False
    if not (payload.startswith(b"\xff\xd8") or payload.startswith(b"\x89PNG")):
        print("    skipped: response was not a JPEG or PNG")
        return False

    with open(destination, "wb") as handle:
        handle.write(payload)
    print(f"    saved {os.path.relpath(destination, ROOT)} ({len(payload) // 1024} KB)")
    return True


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--force", action="store_true", help="re-fetch existing covers")
    parser.add_argument("--dry-run", action="store_true", help="don't write anything")
    args = parser.parse_args()

    source = open(DATA_FILE, encoding="utf-8").read()
    readings = parse_readings(source)
    if not readings:
        sys.exit("No readings parsed - has app/data/syllabus.ts moved?")

    os.makedirs(COVER_DIR, exist_ok=True)
    updated, skipped = [], []

    for reading in readings:
        slug, title, author = reading["slug"], reading["title"], reading["author"]

        if reading["format"] != "book":
            skipped.append(f"{slug} (no printed cover - {reading['format']})")
            continue
        if not args.force and not (reading["coverUrl"] or "").endswith(".svg"):
            skipped.append(f"{slug} (already has real artwork)")
            continue

        print(f"  {title} - {author}")
        url = openlibrary_cover_url(title, author) or google_books_cover_url(title, author)
        if not url:
            print("    no cover found")
            continue

        destination = os.path.join(COVER_DIR, f"{slug}.jpg")
        if download_cover(url, destination, args.dry_run):
            updated.append(slug)
        time.sleep(1)  # be polite to the free APIs

    if updated and not args.dry_run:
        for slug in updated:
            source = source.replace(
                f'coverUrl: "/images/syllabus/{slug}.svg"',
                f'coverUrl: "/images/books/{slug}.jpg"',
            )
        with open(DATA_FILE, "w", encoding="utf-8") as handle:
            handle.write(source)
        print(f"\nRewrote coverUrl for {len(updated)} readings in app/data/syllabus.ts")

    print(f"\n{len(updated)} covers fetched, {len(skipped)} skipped")
    for note in skipped:
        print(f"  - {note}")
    if updated:
        print("\nNext: npm run build, then commit the new covers and syllabus.ts")


if __name__ == "__main__":
    main()
