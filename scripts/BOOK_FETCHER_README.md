# Book Data Fetcher Tools

Python scripts to help populate book data for the `books.ts` file with your "Ingestion Queue" / pending books.

## Overview

Two scripts are available:

1. **`book_data_generator.py`** ⭐ **RECOMMENDED** - CSV-based book data generator
2. **`fetch_book_data.py`** - Attempt HTML scraping (limited effectiveness due to Amazon blocks)

## book_data_generator.py (Recommended)

The easiest workflow for adding books from your backlog.

### Features

- ✅ Read book data from CSV files
- ✅ Download book cover images from Amazon URLs
- ✅ Generate URL-friendly slugs automatically
- ✅ Generate TypeScript or JSON output
- ✅ Batch processing
- ✅ Automatic image normalization for high resolution
- ✅ No external dependencies (Python standard library only!)

### Installation

No dependencies needed! Just Python 3.6+

```bash
python3 --version
```

### CSV Format

Create a CSV file with this header and data rows:

```csv
title,author,description,image_url,amazon_url,genre,published_year,pages,publisher,rating
```

Example:

```csv
title,author,description,image_url,amazon_url,genre,published_year,pages,publisher,rating
The Man Who Saw Seconds,Alexander Boldizar,A high-octane thriller about time perception,https://m.media-amazon.com/images/I/91kRoTHx4pL._SL1500_.jpg,https://www.amazon.com/The-Man-Who-Saw-Seconds/dp/B0FHMVCC4S/,Science Fiction,2024,416,Clash Books,4.5/5
```

See `example_books.csv` for a complete example.

### Usage

#### Basic Usage - Print to Console

```bash
python scripts/book_data_generator.py --file books.csv
```

#### Download Images

Automatically download cover images to `public/images/books/`:

```bash
python scripts/book_data_generator.py --file books.csv --download-images
```

#### Save Output to File

```bash
python scripts/book_data_generator.py --file books.csv --output new_books.ts
```

#### Download Images + Save Output

```bash
python scripts/book_data_generator.py --file books.csv --download-images --output new_books.ts
```

#### JSON Output

```bash
python scripts/book_data_generator.py --file books.csv --format json
```

### Workflow

#### Step 1: Create your CSV file

Gather book information from Amazon (title, author, image URL, etc.) and put it in a CSV file:

```bash
cat > my_books.csv << EOF
title,author,description,image_url,amazon_url,genre,published_year,pages,publisher,rating
The Man Who Saw Seconds,Alexander Boldizar,A high-octane thriller,https://m.media-amazon.com/...,https://www.amazon.com/...,Science Fiction,2024,416,Clash Books,4.5/5
Another Book,Jane Doe,Great description,https://m.media-amazon.com/...,https://www.amazon.com/...,Fiction,2023,350,Publisher,4.3/5
EOF
```

**Pro Tip**: You can find image URLs by viewing a book on Amazon, right-clicking the cover, and copying the image URL. Look for `.SL` URLs (e.g., `_SL1500_` is high resolution).

#### Step 2: Generate book entries with images

```bash
python scripts/book_data_generator.py --file my_books.csv --download-images --output pending_books.ts
```

#### Step 3: Review the generated file

Open `pending_books.ts` and verify:
- Images downloaded correctly to `public/images/books/`
- All book data is correct
- Fill in any `[Add ...]` placeholders if needed

#### Step 4: Copy to books.ts

Open `app/data/books.ts` and paste the entries at the beginning of the `books: Book[]` array (newest books first).

#### Step 5: Commit and deploy

```bash
git add -A
git commit -m "feat: Add new books to ingestion queue"
git push
vercel --prod  # or npm run deploy
```

### Output Example

**TypeScript Format (default):**

```typescript
{
    title: "The Man Who Saw Seconds",
    author: "Alexander Boldizar",
    description: "A high-octane thriller about time perception",
    coverUrl: "/images/books/the-man-who-saw-seconds-alexander-boldizar.jpg",
    amazonUrl: "https://www.amazon.com/The-Man-Who-Saw-Seconds/dp/B0FHMVCC4S/",
    slug: "the-man-who-saw-seconds-alexander-boldizar",
    status: "pending",
    detailedDescription: "[Add detailed description]",
    genre: "Science Fiction",
    publishedYear: "2024",
    pages: "416",
    publisher: "Clash Books",
    rating: "4.5/5"
  },
```

### Tips

- **Keep a master CSV**: Create a `pending_books_backlog.csv` file with all your queue books, then run the tool periodically
- **Slugs are auto-generated**: Based on title + author, URL-safe and lowercase
- **Image URLs**: Amazon uses different formats; the script normalizes to high resolution (SL1500)
- **Status field**: Always set to "pending" initially; you can change to "reading" or "read" later
- **Detailed description**: Fill this in manually for a better reading experience on the book detail pages

---

## fetch_book_data.py (Alternative)

Attempts to automatically scrape book data from Amazon URLs. Limited effectiveness due to Amazon's anti-scraping measures.

### Features

- Attempt to extract title and author from Amazon pages
- Download book covers
- Generate TypeScript or JSON output

### Usage

```bash
# Single book
python scripts/fetch_book_data.py "https://www.amazon.com/gp/product/ASIN"

# Multiple books
python scripts/fetch_book_data.py url1 url2 url3

# From file
python scripts/fetch_book_data.py --file urls.txt --download-images

# Get help
python scripts/fetch_book_data.py --help
```

### Limitations

- Amazon frequently blocks scraping attempts
- Author extraction is unreliable
- Description is not extracted (you'd need to add manually)
- **`book_data_generator.py` is more reliable**

---

## Quick Reference

```bash
# Most common workflow
python scripts/book_data_generator.py --file my_books.csv --download-images --output pending_books.ts

# Then review pending_books.ts and copy entries to app/data/books.ts
```

## Troubleshooting

### "File not found"

Make sure the CSV file exists and path is correct:

```bash
ls -la my_books.csv
```

### Image downloads fail

Check your internet connection. Some Amazon image URLs may be region-restricted. Try a different image URL format if available.

### CSV parsing errors

Make sure your CSV has the correct header row and proper formatting. Fields with commas should be quoted:

```csv
title,author,description,image_url,amazon_url,genre,published_year,pages,publisher,rating
"Book Title, With Comma",Author Name,Description,url,amazon_url,Genre,2024,300,Publisher,4.5/5
```

---

## Notes

- Both scripts use only Python standard library - no `pip install` needed
- No rate limiting or delays between requests
- Always review generated data before committing to books.ts
- Images are normalized to high resolution (SL1500 on Amazon)
- Generated slugs are URL-safe and lowercase, max 60 characters

---

**Enjoy building your reading backlog! 📚**
