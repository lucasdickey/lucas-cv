#!/usr/bin/env python3
"""
Generate book entries for books.ts from a CSV file.

Since Amazon blocks automated scraping, this tool accepts manually-entered book data
and generates TypeScript entries.

CSV Format:
    title,author,description,image_url,amazon_url,genre,published_year,pages,publisher,rating

Example:
    The Man Who Saw Seconds,Alexander Boldizar,A high-octane thriller about time perception,https://m.media-amazon.com/images/I/91kRoTHx4pL._SL1500_.jpg,https://www.amazon.com/The-Man-Who-Saw-Seconds/dp/B0FHMVCC4S/,Science Fiction / Thriller,2024,416,Clash Books,4.5/5

Usage:
    python scripts/book_data_generator.py --file books.csv --download-images
    python scripts/book_data_generator.py --file books.csv --output new_books.ts
"""

import sys
import csv
import json
import re
import urllib.request
from pathlib import Path
import argparse
from typing import Dict, List, Optional
import ssl


class BookDataGenerator:
    """Generate book entries from CSV data."""

    def __init__(self):
        self.user_agent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"

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

    def normalize_image_url(self, url: str) -> str:
        """Normalize Amazon image URL to high-resolution version."""
        if not url:
            return ""

        # Convert to SL1500 (high resolution)
        url = re.sub(r'\.SL\d+_\.', '.SL1500_.', url)
        if '.SL' not in url:
            url = re.sub(r'(\._[A-Z0-9]+\.jpg)', '.SL1500_.jpg', url)

        return url

    def read_csv(self, file_path: Path) -> List[Dict]:
        """Read book data from CSV file."""
        books = []
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    if row.get('title'):  # Skip empty rows
                        books.append(row)
            return books
        except FileNotFoundError:
            print(f"Error: File '{file_path}' not found", file=sys.stderr)
            return []
        except Exception as e:
            print(f"Error reading CSV: {e}", file=sys.stderr)
            return []

    def process_book(self, data: Dict) -> Dict:
        """Process book data into book entry."""
        title = data.get('title', '').strip()
        author = data.get('author', '').strip() or 'Unknown Author'
        description = data.get('description', '').strip() or '[Add description]'
        image_url = data.get('image_url', '').strip()
        amazon_url = data.get('amazon_url', '').strip()
        genre = data.get('genre', '').strip() or '[Add genre]'
        published_year = data.get('published_year', '').strip() or '[Add year]'
        pages = data.get('pages', '').strip() or '[Add pages]'
        publisher = data.get('publisher', '').strip() or '[Add publisher]'
        rating = data.get('rating', '').strip() or '[Add rating]'

        slug = self.generate_slug(title, author)
        image_url = self.normalize_image_url(image_url)

        return {
            'title': title,
            'author': author,
            'description': description,
            'coverUrl': f'/images/books/{slug}.jpg',
            'amazonUrl': amazon_url or 'https://www.amazon.com/',
            'slug': slug,
            'status': 'pending',
            'detailedDescription': '[Add detailed description]',
            'genre': genre,
            'publishedYear': published_year,
            'pages': pages,
            'publisher': publisher,
            'rating': rating,
            'imageUrl': image_url,  # For downloading
        }


def format_book_entry(book_data: Dict) -> str:
    """Format book data as TypeScript object."""
    lines = ["{"]

    # Ordered fields for consistent output
    field_order = [
        'title', 'author', 'description', 'coverUrl', 'amazonUrl', 'slug',
        'status', 'detailedDescription', 'genre', 'publishedYear', 'pages',
        'publisher', 'rating'
    ]

    for key in field_order:
        if key in book_data:
            value = book_data[key]
            # Escape quotes and newlines in strings
            escaped = value.replace('\\', '\\\\').replace('"', '\\"')
            lines.append(f'    {key}: "{escaped}",')

    lines[-1] = lines[-1].rstrip(',')  # Remove trailing comma from last line
    lines.append("  },")

    return "\n".join(lines)


def main():
    parser = argparse.ArgumentParser(
        description='Generate book.ts entries from CSV data',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
CSV Format (one header row, then data rows):
    title,author,description,image_url,amazon_url,genre,published_year,pages,publisher,rating

Example:
    The Man Who Saw Seconds,Alexander Boldizar,A high-octane thriller,https://m.media-amazon.com/...,https://www.amazon.com/...,Science Fiction,2024,416,Clash Books,4.5/5

Examples:
  # Generate from CSV, download images
  python scripts/book_data_generator.py --file books.csv --download-images

  # Generate TypeScript output
  python scripts/book_data_generator.py --file books.csv --output new_books.ts

  # Generate JSON
  python scripts/book_data_generator.py --file books.csv --format json
        """
    )

    parser.add_argument('--file', required=True, help='CSV file with book data')
    parser.add_argument('--output', help='Save output to file')
    parser.add_argument('--download-images', action='store_true',
                       help='Download book cover images to public/images/books/')
    parser.add_argument('--format', choices=['typescript', 'json'], default='typescript',
                       help='Output format')

    args = parser.parse_args()

    # Read CSV
    generator = BookDataGenerator()
    books_data = generator.read_csv(Path(args.file))

    if not books_data:
        print("No books found in CSV file", file=sys.stderr)
        return 1

    print(f"Processing {len(books_data)} book(s)...", file=sys.stderr)

    processed_books = []
    for i, book_csv in enumerate(books_data, 1):
        print(f"  [{i}/{len(books_data)}] {book_csv.get('title', 'Unknown')}", file=sys.stderr)
        book_data = generator.process_book(book_csv)
        processed_books.append(book_data)

        # Download image if requested
        if args.download_images and book_data.get('imageUrl'):
            images_dir = Path('public/images/books')
            images_dir.mkdir(parents=True, exist_ok=True)

            image_path = images_dir / f"{book_data['slug']}.jpg"
            if generator.download_image(book_data['imageUrl'], image_path):
                print(f"    ✓ Downloaded image", file=sys.stderr)
            else:
                print(f"    ✗ Failed to download image", file=sys.stderr)

    # Format output
    if args.format == 'json':
        output_data = [
            {k: v for k, v in b.items() if k not in ['imageUrl']}
            for b in processed_books
        ]
        output = json.dumps(output_data, indent=2)
    else:
        # TypeScript format
        entries = [format_book_entry(book) for book in processed_books]
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

    print(f"\nProcessed {len(processed_books)} book(s) successfully", file=sys.stderr)
    if args.download_images:
        print("Images downloaded to public/images/books/", file=sys.stderr)
        print("Review them before committing!", file=sys.stderr)

    return 0


if __name__ == '__main__':
    sys.exit(main())
