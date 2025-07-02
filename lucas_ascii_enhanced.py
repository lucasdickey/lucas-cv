#!/usr/bin/env python3
"""
Enhanced LUCAS ASCII art with uniform width and letter patterns
"""

def create_lucas_ascii():
    """
    Create LUCAS ASCII art where each letter is made from its own character
    with uniform width for better appearance
    """
    
    # Each letter will be 8 chars wide with 2 char spacing
    lucas_art = []
    
    # Double height version - each line appears twice
    patterns = [
        "L       L  U     U   CCCCCC    AAAAA    SSSSS  ",
        "L       L  U     U   CCCCCC    AAAAA    SSSSS  ",
        "L       L  U     U  C         A     A  S       ",
        "L       L  U     U  C         A     A  S       ",
        "L       L  U     U  C         AAAAAAA   SSSSS  ",
        "L       L  U     U  C         AAAAAAA   SSSSS  ",
        "L       L  U     U  C         A     A        S ",
        "L       L  U     U  C         A     A        S ",
        "LLLLLLLL   UUUUUU    CCCCCC   A     A   SSSSS  ",
        "LLLLLLLL   UUUUUU    CCCCCC   A     A   SSSSS  "
    ]
    
    return "\n".join(patterns)

def create_lucas_ascii_blocks():
    """
    Create a block-style version using Unicode block characters
    """
    # Using Unicode blocks for more visual impact
    block = "█"
    
    patterns = []
    
    # L pattern
    L = [
        f"{block*3}      ",
        f"{block*3}      ",
        f"{block*3}      ",
        f"{block*3}      ",
        f"{block*8}"
    ]
    
    # U pattern  
    U = [
        f"{block*3}  {block*3}",
        f"{block*3}  {block*3}",
        f"{block*3}  {block*3}",
        f"{block*3}  {block*3}",
        f" {block*6} "
    ]
    
    # C pattern
    C = [
        f" {block*6} ",
        f"{block*3}     ",
        f"{block*3}     ",
        f"{block*3}     ",
        f" {block*6} "
    ]
    
    # A pattern
    A = [
        f" {block*6} ",
        f"{block*3}  {block*3}",
        f"{block*8}",
        f"{block*3}  {block*3}",
        f"{block*3}  {block*3}"
    ]
    
    # S pattern
    S = [
        f" {block*6} ",
        f"{block*3}     ",
        f" {block*6} ",
        f"     {block*3}",
        f" {block*6} "
    ]
    
    # Combine letters with spacing, doubled height
    for row in range(5):
        line = ""
        line += L[row] + "  "
        line += U[row] + "  "
        line += C[row] + "  "
        line += A[row] + "  "
        line += S[row]
        # Double each line for height
        patterns.append(line)
        patterns.append(line)
    
    return "\n".join(patterns)

def create_mixed_style():
    """
    Create a version that uses the letter itself in the pattern
    Each letter is 8 chars wide for uniformity
    """
    patterns = []
    
    # Define each letter pattern using the letter itself
    L = [
        "LLL     ",
        "LLL     ",
        "LLL     ",
        "LLL     ",
        "LLLLLLLL"
    ]
    
    U = [
        "UUU  UUU",
        "UUU  UUU",
        "UUU  UUU",
        "UUU  UUU",
        " UUUUUU "
    ]
    
    C = [
        " CCCCCC ",
        "CCC     ",
        "CCC     ",
        "CCC     ",
        " CCCCCC "
    ]
    
    A = [
        " AAAAAA ",
        "AAA  AAA",
        "AAAAAAAA",
        "AAA  AAA",
        "AAA  AAA"
    ]
    
    S = [
        " SSSSSS ",
        "SSS     ",
        " SSSSSS ",
        "     SSS",
        " SSSSSS "
    ]
    
    # Combine with double height
    for row in range(5):
        line = ""
        line += L[row] + "  "
        line += U[row] + "  "
        line += C[row] + "  "
        line += A[row] + "  "
        line += S[row]
        # Double each line
        patterns.append(line)
        patterns.append(line)
    
    return "\n".join(patterns)

def main():
    print("LUCAS ASCII Art - Enhanced Version")
    print("=" * 50)
    
    print("\n1. Letter-based pattern (each letter made from itself):")
    print(create_mixed_style())
    
    print("\n\n2. Block style:")
    print(create_lucas_ascii_blocks())
    
    print("\n\n3. Simple letter pattern:")
    print(create_lucas_ascii())
    
    # Save the letter-based version to file
    with open('lucas_ascii_doubled.txt', 'w') as f:
        f.write(create_mixed_style())
    
    print("\n\nSaved letter-based version to: lucas_ascii_doubled.txt")

if __name__ == "__main__":
    main()