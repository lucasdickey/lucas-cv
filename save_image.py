#!/usr/bin/env python3
"""
Save the uploaded image for ASCII conversion
"""

import base64
from PIL import Image
import io

# This will be replaced with the actual image data
# For now, I'll create a simple test to make sure our ASCII converter works

def create_test_image():
    """Create a test gradient image to verify the ASCII converter works"""
    from PIL import Image, ImageDraw
    
    # Create a 200x200 gradient image
    img = Image.new('L', (200, 200))
    draw = ImageDraw.Draw(img)
    
    # Create a gradient from dark to light
    for y in range(200):
        for x in range(200):
            # Create circular gradient
            center_x, center_y = 100, 100
            distance = ((x - center_x)**2 + (y - center_y)**2)**0.5
            max_distance = (100**2 + 100**2)**0.5
            
            # Normalize distance and invert for gradient effect
            brightness = int(255 * (1 - min(distance / max_distance, 1)))
            img.putpixel((x, y), brightness)
    
    img.save('test_gradient.png')
    print("Created test gradient image: test_gradient.png")

if __name__ == "__main__":
    create_test_image()