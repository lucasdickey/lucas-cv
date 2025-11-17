#!/usr/bin/env python3
"""
Fetch book data from Amazon URLs and generate book.ts entries.

Usage:
    python scripts/fetch_book_data.py <amazon_url> [<amazon_url> ...]
    python scripts/fetch_book_data.py --file urls.txt

Options:
    --file FILE    Read Amazon URLs from a text file (one URL per line)
    --output FILE  Save output to a file instead of printing
    --format json  Output as JSON array (default: typescript)
"""

import sys
import json
import re
import urllib.request
import urllib.error
from urllib.parse import urlparse, parse_qs
from pathlib import Path
import argparse
from typing import Dict, List, Optional, Tuple
import hashlib
import ssl


class AmazonBookScraper:
    """Scrape book data from Amazon product pages."""

    def __init__(self):
        self.user_agent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
        self.session = None

    def extract_asin_from_url(self, url: str) -> Optional[str]:
        """Extract ASIN from Amazon URL."""
        # Pattern for /dp/ASIN or /gp/product/ASIN
        match = re.search(r'/(?:dp|gp/product)/([A-Z0-9]{10})', url)
        if match:
            return match.group(1)
        return None

    def fetch_page(self, url: str) -> Optional[str]:
        """Fetch Amazon product page."""
        try:
            req = urllib.request.Request(
                url,
                headers={'User-Agent': self.user_agent}
            )
            # Disable SSL verification for macOS certificate issues
            ssl_context = ssl.create_default_context()
            ssl_context.check_hostname = False
            ssl_context.verify_mode = ssl.CERT_NONE

            with urllib.request.urlopen(req, timeout=10, context=ssl_context) as response:
                return response.read().decode('utf-8', errors='ignore')
        except Exception as e:
            print(f"Error fetching {url}: {e}", file=sys.stderr)
            return None

    def extract_image_url(self, html: str) -> Optional[str]:
        """Extract primary book cover image URL from Amazon HTML."""
        # Look for the main product image in various formats
        patterns = [
            # Pattern 1: "imageBlockVariations"
            r'"imageBlockVariations":\s*\[.*?"url":"([^"]*)"',
            # Pattern 2: High-res image URL in image tags
            r'"landingImage":\{"url":"([^"]*)"',
            # Pattern 3: Direct image URL in img src
            r'<img[^>]*id="landingImage"[^>]*src="([^"]*)"',
            # Pattern 4: Dynamic image data
            r'"mainImage":\{"url":"([^"]*)"',
        ]

        for pattern in patterns:
            match = re.search(pattern, html)
            if match:
                url = match.group(1)
                # Clean up escaped slashes
                url = url.replace('\\/', '/')
                if url.startswith('http'):
                    return url

        return None

    def extract_title(self, html: str) -> Optional[str]:
        """Extract book title."""
        patterns = [
            r'"title":{"displayString":"([^"]*)"',
            r'<h1[^>]*>([^<]*)</h1>',
            r'"productTitle":"([^"]*)"',
        ]

        for pattern in patterns:
            match = re.search(pattern, html)
            if match:
                return match.group(1).strip()

        return None

    def extract_author(self, html: str) -> Optional[str]:
        """Extract author name."""
        # Look for author in byline
        patterns = [
            r'by\s+<a[^>]*>([^<]*)</a>',
            r'"authors":\s*\[\s*"([^"]*)"',
            r'<span[^>]*class="a-size-base"[^>]*>([^<]*)</span>',
        ]

        for pattern in patterns:
            match = re.search(pattern, html)
            if match:
                return match.group(1).strip()

        return None

    def normalize_image_url(self, url: str) -> str:
        """Normalize Amazon image URL to high-resolution version."""
        if not url:
            return ""

        # Convert to SL1500 (high resolution)
        url = re.sub(r'\.SL\d+_\.', '.SL1500_.', url)
        if '.SL' not in url:
            url = re.sub(r'(\._[A-Z0-9]+\.jpg)', '.SL1500_.jpg', url)

        return url

    def download_image(self, image_url: str, output_path: Path) -> bool:
        """Download book cover image."""
        if not image_url:
            return False

        try:
            req = urllib.request.Request(
                image_url,
                headers={'User-Agent': self.user_agent}
            )
            # Disable SSL verification for macOS certificate issues
            ssl_context = ssl.create_default_context()
            ssl_context.check_hostname = False
            ssl_context.verify_mode = ssl.CERT_NONE

            with urllib.request.urlopen(req, timeout=10, context=ssl_context) as response:
                with open(output_path, 'wb') as f:
                    f.write(response.read())
            return True
        except Exception as e:
            print(f"Error downloading image {image_url}: {e}", file=sys.stderr)
            return False

    def generate_slug(self, title: str, author: str = "") -> str:
        """Generate URL-friendly slug from title and author."""
        combined = f"{title} {author}".lower()
        # Remove special characters, keep only alphanumeric and hyphens
        slug = re.sub(r'[^a-z0-9\s-]', '', combined)
        # Replace spaces with hyphens
        slug = re.sub(r'\s+', '-', slug)
        # Remove multiple hyphens
        slug = re.sub(r'-+', '-', slug)
        # Remove trailing hyphens
        slug = slug.strip('-')
        return slug[:60]  # Keep it reasonable length

    def fetch_book_data(self, amazon_url: str) -> Optional[Dict]:
        """Fetch all book data from Amazon URL."""
        asin = self.extract_asin_from_url(amazon_url)
        if not asin:
            print(f"Could not extract ASIN from {amazon_url}", file=sys.stderr)
            return None

        html = self.fetch_page(amazon_url)
        if not html:
            return None

        title = self.extract_title(html)
        author = self.extract_author(html)
        image_url = self.extract_image_url(html)

        if not title:
            print(f"Could not extract title from {amazon_url}", file=sys.stderr)
            return None

        image_url = self.normalize_image_url(image_url)
        slug = self.generate_slug(title, author)

        book_data = {
            'title': title,
            'author': author or 'Unknown Author',
            'description': '[Add description]',
            'coverUrl': f'/images/books/{slug}.jpg',
            'amazonUrl': amazon_url,
            'slug': slug,
            'status': 'pending',
            'detailedDescription': '[Add detailed description]',
            'genre': '[Add genre]',
            'publishedYear': '[Add year]',
            'pages': '[Add pages]',
            'publisher': '[Add publisher]',
            'rating': '[Add rating]',
            'imageUrl': image_url,  # Include for reference
            'asin': asin,
        }

        return book_data


def format_book_entry(book_data: Dict, include_image_url: bool = False) -> str:
    """Format book data as TypeScript object."""
    lines = ["{"]

    for key, value in book_data.items():
        if key in ['imageUrl', 'asin']:  # Skip non-book.ts fields
            continue

        if isinstance(value, str):
            # Escape quotes and newlines in strings
            escaped = value.replace('\\', '\\\\').replace('"', '\\"')
            lines.append(f'    {key}: "{escaped}",')

    lines[-1] = lines[-1].rstrip(',')  # Remove trailing comma from last line
    lines.append("  },")

    return "\n".join(lines)


def format_book_json(book_data: Dict) -> str:
    """Format book data as JSON."""
    json_data = {k: v for k, v in book_data.items() if k not in ['imageUrl', 'asin']}
    return json.dumps(json_data, indent=2)


def main():
    parser = argparse.ArgumentParser(
        description='Fetch book data from Amazon URLs and generate book.ts entries',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Single book
  python scripts/fetch_book_data.py "https://www.amazon.com/gp/product/B0FHMVCC4S"

  # Multiple books
  python scripts/fetch_book_data.py url1 url2 url3

  # From file
  python scripts/fetch_book_data.py --file book_urls.txt

  # Save to file
  python scripts/fetch_book_data.py url1 url2 --output books_output.txt

  # JSON output
  python scripts/fetch_book_data.py url --format json
        """
    )

    parser.add_argument('urls', nargs='*', help='Amazon book URLs')
    parser.add_argument('--file', help='Read URLs from file (one per line)')
    parser.add_argument('--output', help='Save output to file')
    parser.add_argument('--download-images', action='store_true',
                       help='Download book cover images to public/images/books/')
    parser.add_argument('--format', choices=['typescript', 'json'], default='typescript',
                       help='Output format')

    args = parser.parse_args()

    # Collect URLs
    urls = args.urls or []
    if args.file:
        try:
            with open(args.file, 'r') as f:
                file_urls = [line.strip() for line in f if line.strip()]
                urls.extend(file_urls)
        except FileNotFoundError:
            print(f"Error: File '{args.file}' not found", file=sys.stderr)
            return 1

    if not urls:
        parser.print_help()
        return 1

    # Fetch book data
    scraper = AmazonBookScraper()
    books_data = []

    print(f"Fetching data for {len(urls)} book(s)...", file=sys.stderr)

    for url in urls:
        print(f"Processing: {url}", file=sys.stderr)
        book_data = scraper.fetch_book_data(url)

        if book_data:
            books_data.append(book_data)

            # Download image if requested
            if args.download_images and book_data.get('imageUrl'):
                images_dir = Path('public/images/books')
                images_dir.mkdir(parents=True, exist_ok=True)

                image_path = images_dir / f"{book_data['slug']}.jpg"
                if scraper.download_image(book_data['imageUrl'], image_path):
                    print(f"  ✓ Downloaded image to {image_path}", file=sys.stderr)
                else:
                    print(f"  ✗ Failed to download image", file=sys.stderr)
        else:
            print(f"  ✗ Failed to extract book data", file=sys.stderr)

    if not books_data:
        print("No books were successfully processed", file=sys.stderr)
        return 1

    # Format output
    if args.format == 'json':
        output = json.dumps(books_data, indent=2)
    else:
        # TypeScript format
        entries = [format_book_entry(book) for book in books_data]
        output = "// Add these entries to books: Book[] in app/data/books.ts\n\n"
        output += "[\n  " + "\n  ".join(entries) + "\n]"

    # Output
    if args.output:
        with open(args.output, 'w') as f:
            f.write(output)
        print(f"\nOutput saved to {args.output}", file=sys.stderr)
    else:
        print("\n" + "="*80)
        print(output)
        print("="*80)

    print(f"\nProcessed {len(books_data)} book(s) successfully", file=sys.stderr)

    if args.download_images:
        print("\nNote: Please review the downloaded images and descriptions", file=sys.stderr)
        print("Copy the book entries to app/data/books.ts", file=sys.stderr)

    return 0


if __name__ == '__main__':
    sys.exit(main())
