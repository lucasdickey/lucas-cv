#!/usr/bin/env python3
"""
Generate book cover placeholder images for CV site.
Creates professional-looking book cover images with titles and authors.
"""

from PIL import Image, ImageDraw, ImageFont
import textwrap
import os

def create_book_cover(title, author, filename, width=400, height=600):
    """Create a book cover image with title and author."""
    
    # Create a new image with a gradient background
    img = Image.new('RGB', (width, height), color='#2c3e50')
    draw = ImageDraw.Draw(img)
    
    # Create a subtle gradient effect
    for i in range(height):
        color_value = int(44 + (i / height) * 20)  # Gradient from #2c3e50 to slightly lighter
        draw.line([(0, i), (width, i)], fill=(color_value, color_value + 20, color_value + 30))
    
    # Add a decorative border
    border_width = 10
    draw.rectangle([border_width, border_width, width - border_width, height - border_width], 
                  outline='#34495e', width=3)
    
    # Try to load a font, fall back to default if not available
    try:
        title_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 36)
        author_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 24)
    except:
        try:
            title_font = ImageFont.truetype("arial.ttf", 36)
            author_font = ImageFont.truetype("arial.ttf", 24)
        except:
            title_font = ImageFont.load_default()
            author_font = ImageFont.load_default()
    
    # Wrap title text
    title_lines = textwrap.wrap(title, width=20)
    author_lines = textwrap.wrap(author, width=25)
    
    # Calculate text positioning
    title_y = height // 3
    line_height = 45
    
    # Draw title
    for i, line in enumerate(title_lines):
        bbox = draw.textbbox((0, 0), line, font=title_font)
        text_width = bbox[2] - bbox[0]
        x = (width - text_width) // 2
        y = title_y + i * line_height
        
        # Add text shadow for better readability
        draw.text((x + 2, y + 2), line, font=title_font, fill='#000000')
        draw.text((x, y), line, font=title_font, fill='#ecf0f1')
    
    # Draw author
    author_y = height - 150
    for i, line in enumerate(author_lines):
        bbox = draw.textbbox((0, 0), line, font=author_font)
        text_width = bbox[2] - bbox[0]
        x = (width - text_width) // 2
        y = author_y + i * 30
        
        # Add text shadow
        draw.text((x + 1, y + 1), line, font=author_font, fill='#000000')
        draw.text((x, y), line, font=author_font, fill='#bdc3c7')
    
    return img

def main():
    """Generate all book cover images."""
    
    # Book data
    books = [
        {
            "title": "Tomorrow, and Tomorrow, and Tomorrow",
            "author": "Gabrielle Zevin",
            "filename": "tomorrow-and-tomorrow.jpg"
        },
        {
            "title": "Amusing Ourselves to Death",
            "author": "Neil Postman",
            "filename": "amusing-ourselves-to-death.jpg"
        },
        {
            "title": "Abundance: Progress Takes Imagination",
            "author": "Ezra Klein",
            "filename": "abundance-progress.jpg"
        },
        {
            "title": "Animal Farm",
            "author": "George Orwell",
            "filename": "animal-farm.jpg"
        },
        {
            "title": "Do Androids Dream Of Electric Sheep?",
            "author": "Philip K. Dick",
            "filename": "do-androids-dream.jpg"
        },
        {
            "title": "Artificial Intelligence: A Modern Approach",
            "author": "Peter Norvig & Stuart Russell",
            "filename": "ai-modern-approach.jpg"
        },
        {
            "title": "The Business of Venture Capital",
            "author": "Mahendra Ramsinghani",
            "filename": "business-venture-capital.jpg"
        },
        {
            "title": "Exhalation: Stories",
            "author": "Ted Chiang",
            "filename": "exhalation-stories.jpg"
        }
    ]
    
    # Create output directory
    output_dir = "public/images/books"
    os.makedirs(output_dir, exist_ok=True)
    
    # Generate each book cover
    for book in books:
        print(f"Generating cover for: {book['title']}")
        
        # Create the book cover image
        cover_img = create_book_cover(
            book["title"], 
            book["author"], 
            book["filename"]
        )
        
        # Save the image
        output_path = os.path.join(output_dir, book["filename"])
        cover_img.save(output_path, "JPEG", quality=95)
        print(f"Saved: {output_path}")
    
    print("\nAll book covers generated successfully!")

if __name__ == "__main__":
    main()