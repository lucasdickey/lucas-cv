#!/usr/bin/env python3
"""
High-fidelity ASCII Art Converter
Converts images to ASCII art with character-based grayscale mapping
"""

from PIL import Image
import sys
import os

def image_to_ascii(image_path, width=80, height_ratio=0.5):
    """
    Convert an image to ASCII art with grayscale mapping
    
    Args:
        image_path: Path to the input image
        width: Target width in characters
        height_ratio: Aspect ratio adjustment (since terminal chars are taller than wide)
    
    Returns:
        ASCII art as string
    """
    
    # ASCII characters for grayscale mapping (darkest to lightest)
    # Using a comprehensive set for better depth representation
    ascii_chars = "@%#*+=-:. "
    
    try:
        # Open and process the image
        img = Image.open(image_path)
        
        # Convert to grayscale
        img = img.convert('L')
        
        # Calculate new dimensions maintaining aspect ratio
        original_width, original_height = img.size
        aspect_ratio = original_height / original_width
        new_height = int(aspect_ratio * width * height_ratio)
        
        # Resize image
        img = img.resize((width, new_height))
        
        # Convert pixels to ASCII
        pixels = img.getdata()
        ascii_str = ""
        
        for i, pixel in enumerate(pixels):
            # Map pixel value (0-255) to ascii character index
            ascii_index = min(len(ascii_chars) - 1, pixel // (256 // len(ascii_chars)))
            ascii_str += ascii_chars[ascii_index]
            
            # Add newline at end of each row
            if (i + 1) % width == 0:
                ascii_str += "\n"
        
        return ascii_str
        
    except Exception as e:
        return f"Error processing image: {str(e)}"

def main():
    if len(sys.argv) != 2:
        print("Usage: python ascii_converter.py <image_path>")
        sys.exit(1)
    
    image_path = sys.argv[1]
    
    if not os.path.exists(image_path):
        print(f"Error: Image file '{image_path}' not found")
        sys.exit(1)
    
    # Generate ASCII art with different sizes for testing
    widths = [60, 80, 100]
    
    for width in widths:
        print(f"\n{'='*50}")
        print(f"ASCII ART - Width: {width} characters")
        print(f"{'='*50}")
        
        ascii_art = image_to_ascii(image_path, width=width)
        print(ascii_art)
        
        # Save to file as well
        output_file = f"ascii_art_{width}.txt"
        with open(output_file, 'w') as f:
            f.write(ascii_art)
        print(f"Saved to: {output_file}")

if __name__ == "__main__":
    main()