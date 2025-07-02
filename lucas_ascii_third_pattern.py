#!/usr/bin/env python3
"""
Generate the third LUCAS pattern with crosshatch/mesh style
"""

def create_lucas_crosshatch():
    """
    Create LUCAS ASCII art using crosshatch pattern (third from top in image)
    """
    # Using various Unicode characters to create a crosshatch effect
    # We'll use ░ ▒ ▓ █ and other patterns
    
    patterns = []
    
    # Define each letter with crosshatch style
    # Using ▒ for the main pattern
    char = "▒"
    
    L = [
        f"{char*3}      ",
        f"{char*3}      ",
        f"{char*3}      ",
        f"{char*3}      ",
        f"{char*8}"
    ]
    
    U = [
        f"{char*3}  {char*3}",
        f"{char*3}  {char*3}",
        f"{char*3}  {char*3}",
        f"{char*3}  {char*3}",
        f" {char*6} "
    ]
    
    C = [
        f" {char*6} ",
        f"{char*3}     ",
        f"{char*3}     ",
        f"{char*3}     ",
        f" {char*6} "
    ]
    
    A = [
        f" {char*6} ",
        f"{char*3}  {char*3}",
        f"{char*8}",
        f"{char*3}  {char*3}",
        f"{char*3}  {char*3}"
    ]
    
    S = [
        f" {char*6} ",
        f"{char*3}     ",
        f" {char*6} ",
        f"     {char*3}",
        f" {char*6} "
    ]
    
    # Combine letters with proper spacing
    for row in range(5):
        line = ""
        line += L[row] + "  "
        line += U[row] + "  "
        line += C[row] + "  "
        line += A[row] + "  "
        line += S[row]
        patterns.append(line)
    
    return "\n".join(patterns)

def main():
    print("LUCAS ASCII Art - Third Pattern (Crosshatch)")
    print("=" * 50)
    
    ascii_art = create_lucas_crosshatch()
    print(ascii_art)
    
    # Save to file
    with open('lucas_ascii_pattern3.txt', 'w') as f:
        f.write(ascii_art)
    
    print("\nSaved to: lucas_ascii_pattern3.txt")

if __name__ == "__main__":
    main()