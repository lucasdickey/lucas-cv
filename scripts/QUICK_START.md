# Book Data Tool - Quick Start

## TL;DR

Add books to your reading backlog in 3 steps:

### 1️⃣ Create a CSV file with your books

```bash
cat > my_books.csv << EOF
title,author,description,image_url,amazon_url,genre,published_year,pages,publisher,rating
The Man Who Saw Seconds,Alexander Boldizar,A high-octane thriller,https://m.media-amazon.com/images/I/91kRoTHx4pL._SL1500_.jpg,https://www.amazon.com/The-Man-Who-Saw-Seconds/dp/B0FHMVCC4S/,Science Fiction,2024,416,Clash Books,4.5/5
Another Book,Author Name,Your description,https://image-url.jpg,https://amazon-link,Genre,2023,300,Publisher,4.2/5
EOF
```

**How to get image URLs from Amazon:**
1. Go to the book's Amazon page
2. Right-click the cover image
3. Copy image address (look for URLs with `.SL` like `_SL1500_`)

### 2️⃣ Generate TypeScript entries with images

```bash
python scripts/book_data_generator.py --file my_books.csv --download-images --output pending_books.ts
```

This will:
- ✅ Download all book cover images to `public/images/books/`
- ✅ Generate TypeScript code in `pending_books.ts`
- ✅ Auto-generate URL-friendly slugs

### 3️⃣ Copy to books.ts and deploy

1. Open `pending_books.ts` - review the generated entries
2. Open `app/data/books.ts`
3. Paste the entries at the beginning of the `books: Book[]` array (newest first)
4. Commit and deploy:

```bash
git add -A
git commit -m "feat: Add new books to reading backlog"
git push
vercel --prod
```

---

## Example CSV

```csv
title,author,description,image_url,amazon_url,genre,published_year,pages,publisher,rating
The Man Who Saw Seconds,Alexander Boldizar,A high-octane speculative thriller about time perception,https://m.media-amazon.com/images/I/91kRoTHx4pL._SL1500_.jpg,https://www.amazon.com/The-Man-Who-Saw-Seconds/dp/B0FHMVCC4S/,Science Fiction / Thriller,2024,416,Clash Books,4.5/5
Thinking In Systems,Donella H. Meadows,A primer on systems thinking for problem-solving,https://m.media-amazon.com/images/I/51WRk0bDZZL._SL1500_.jpg,https://www.amazon.com/Thinking-Systems-Donella-H-Meadows/dp/1603580557/,Science / Systems,2008,218,Chelsea Green Publishing,4.2/5
```

See `example_books.csv` for more examples.

---

## Pro Tips

- **Keep a master CSV**: Create `pending_books_backlog.csv` with all books you want to add, run the tool whenever you have time
- **Image URLs matter**: Use high-res URLs (contain `.SL1500_` or similar)
- **No dependencies needed**: Just Python 3.6+ (no `pip install` needed)
- **Batch processing**: Add 10+ books at once, it's just CSV rows!
- **Auto-generated slugs**: Based on title + author, URL-safe and lowercase

---

## Command Reference

```bash
# See all options
python scripts/book_data_generator.py --help

# Just print to console (no images)
python scripts/book_data_generator.py --file books.csv

# Generate TypeScript + download images
python scripts/book_data_generator.py --file books.csv --download-images --output new_books.ts

# JSON format instead
python scripts/book_data_generator.py --file books.csv --format json
```

---

## Need More Help?

See `BOOK_FETCHER_README.md` for complete documentation.

Happy reading! 📚
