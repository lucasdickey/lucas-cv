#!/usr/bin/env python3
"""
Generate the third LUCAS pattern with doubled height
"""

def create_lucas_crosshatch_doubled():
    """
    Create LUCAS ASCII art using crosshatch pattern with doubled height
    """
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
    
    # Combine letters with proper spacing and double each line
    patterns = []
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

def main():
    ascii_art = create_lucas_crosshatch_doubled()
    print(ascii_art)
    
    # Save to file
    with open('lucas_ascii_final.txt', 'w') as f:
        f.write(ascii_art)

if __name__ == "__main__":
    main()