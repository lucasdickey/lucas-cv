#!/usr/bin/env python3
"""
Enhanced ASCII Art Converter for high-fidelity terminal output
Optimized for Lucas's A-OK portrait
"""

from PIL import Image, ImageEnhance, ImageFilter
import sys
import os

def image_to_ascii(image_path, width=70, height_ratio=0.45, contrast_boost=1.3):
    """
    Convert image to high-fidelity ASCII art
    
    Args:
        image_path: Path to input image
        width: Target width in characters
        height_ratio: Aspect ratio adjustment for terminal display
        contrast_boost: Enhance contrast for better ASCII mapping
    
    Returns:
        ASCII art as string
    """
    
    # Comprehensive ASCII character set for better grayscale depth
    # From darkest to lightest with more variation
    ascii_chars = "@&#%8XoOx*+=~-:. "
    
    try:
        # Open and process image
        img = Image.open(image_path)
        
        # Convert to grayscale
        img = img.convert('L')
        
        # Enhance contrast for better ASCII conversion
        enhancer = ImageEnhance.Contrast(img)
        img = enhancer.enhance(contrast_boost)
        
        # Slight blur to reduce noise
        img = img.filter(ImageFilter.GaussianBlur(0.5))
        
        # Calculate dimensions maintaining aspect ratio
        original_width, original_height = img.size
        aspect_ratio = original_height / original_width
        new_height = int(aspect_ratio * width * height_ratio)
        
        # Resize with high-quality resampling
        img = img.resize((width, new_height), Image.Resampling.LANCZOS)
        
        # Convert pixels to ASCII
        pixels = img.getdata()
        ascii_str = ""
        
        for i, pixel in enumerate(pixels):
            # Improved mapping with better distribution
            # Invert pixel value so dark areas use dense characters
            inverted_pixel = 255 - pixel
            ascii_index = min(len(ascii_chars) - 1, inverted_pixel // (256 // len(ascii_chars)))
            ascii_str += ascii_chars[ascii_index]
            
            # Add newline at end of each row
            if (i + 1) % width == 0:
                ascii_str += "\n"
        
        return ascii_str
        
    except Exception as e:
        return f"Error processing image: {str(e)}"

def create_lucas_portrait_ascii():
    """
    Create ASCII art specifically for Lucas's A-OK portrait
    Based on the image structure: rust background, A-OK cap, glasses, beard
    """
    
    # Manual ASCII art creation based on the portrait
    ascii_art = """
                    @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
                 @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
              @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
           @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
        @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
      @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
   @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@########################################@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@&#&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&#@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@&#&&&&&&&&&&&&&&  ::::::::  &&&&&&&&&&&&&&#@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@&&&&&&&&&&&&&&&&&  ......  &&&&&&&&&&&&&&@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@&#&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&#@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@########################################@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ooooooooooooo@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ooooooooooooooooooooo@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@ooooooooooooooooooooooooooo@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@ooooooooooooooooooooooooooooo@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@ooooooo#####################ooooooo@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@ooooo###&&&&###########&&&&###ooooo@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@ooooo##&&&&&###########&&&&&##ooooo@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@oooooo####################&#oooooo@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@oooooooo##################oooooooo@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@ooooooooooooooooooooooooooooooooooo@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@ooooooooooooo:::::::::ooooooooooooo@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@ooooooooo:::::::::::::::::::ooooooo@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@oooooo:::::::::::::::::::::::::oooo@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@ooooo::::::::++++++++++:::::::::ooo@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@oooo:::::+++++++++++++++++++:::::oo@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@ooo:::::++++++++++++++++++++::::::o@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@oo::::+++++++++++++++++++++++++:::o@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@o:::+++++++++++++++++++++++++++:::o@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@o:::+++++++++++++++++++++++++++:::o@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@oo:::++++++++++++++++++++++++++:::@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@ooo:::++++++++++++++++++++++++:::o@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@oooo:::++++++++++++++++++++++:::oo@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@ooooo:::++++++++++++++++++++:::ooo@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@oooooo::::++++++++++++++++::::oooo@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@ooooooo::::+++++++++++++++:::ooooo@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@oooooooo:::::++++++++++++::::ooooo@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@ooooooooo::::::++++++++:::::oooooo@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@oooooooooo::::::++++++:::::ooooooo@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@ooooooooooo:::::::++::::::oooooooo@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@ooooooooooooo::::::::::ooooooooooo@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@ooooooooooooooooooooooooooooooooo@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@ooooooooooooooooooooooooooooooooo@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@ooooooooooooooooooooooooooooo@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ooooooooooooooooooooooo@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ooooooooooooooooo@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ooooooooooo@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
"""
    
    return ascii_art.strip()

def main():
    print("Lucas Dickey - A-OK Portrait ASCII Art")
    print("="*60)
    
    # Create the manual ASCII art
    ascii_art = create_lucas_portrait_ascii()
    print(ascii_art)
    
    # Save to file
    with open('lucas_portrait_ascii.txt', 'w') as f:
        f.write(ascii_art)
    
    print("\nSaved to: lucas_portrait_ascii.txt")
    print(f"Dimensions: ~70 chars wide x ~{ascii_art.count(chr(10))} lines tall")

if __name__ == "__main__":
    main()