#!/usr/bin/env python3
"""
Generate responsive ASCII art for LUCAS in multiple sizes
"""

def create_mobile_ascii():
    """Create compact ASCII art for mobile devices"""
    patterns = [
        "▒▒    ▒▒  ▒▒  ▒▒▒  ▒▒▒  ▒▒▒",
        "▒▒    ▒▒  ▒▒  ▒    ▒▒▒  ▒  ",
        "▒▒    ▒▒  ▒▒  ▒    ▒▒▒  ▒▒▒",
        "▒▒    ▒▒  ▒▒  ▒    ▒ ▒    ▒",
        "▒▒▒▒  ▒▒▒▒   ▒▒▒  ▒  ▒  ▒▒▒"
    ]
    return "\n".join(patterns)

def create_tablet_ascii():
    """Create medium-sized ASCII art for tablets"""
    patterns = [
        "▒▒▒     ▒▒  ▒▒  ▒▒▒▒   ▒▒▒▒   ▒▒▒▒ ",
        "▒▒▒     ▒▒  ▒▒  ▒▒     ▒▒▒▒   ▒▒   ",
        "▒▒▒     ▒▒  ▒▒  ▒▒     ▒▒▒▒   ▒▒▒▒ ",
        "▒▒▒     ▒▒  ▒▒  ▒▒     ▒  ▒      ▒▒",
        "▒▒▒▒▒▒  ▒▒▒▒▒   ▒▒▒▒   ▒  ▒   ▒▒▒▒ "
    ]
    return "\n".join(patterns)

def create_desktop_ascii():
    """Create full-sized ASCII art for desktop"""
    patterns = [
        "▒▒▒        ▒▒▒  ▒▒▒   ▒▒▒▒▒▒    ▒▒▒▒▒▒    ▒▒▒▒▒▒ ",
        "▒▒▒        ▒▒▒  ▒▒▒   ▒▒▒▒▒▒    ▒▒▒▒▒▒    ▒▒▒▒▒▒ ",
        "▒▒▒        ▒▒▒  ▒▒▒  ▒▒▒       ▒▒▒  ▒▒▒  ▒▒▒     ",
        "▒▒▒        ▒▒▒  ▒▒▒  ▒▒▒       ▒▒▒  ▒▒▒  ▒▒▒     ",
        "▒▒▒        ▒▒▒  ▒▒▒  ▒▒▒       ▒▒▒▒▒▒▒▒   ▒▒▒▒▒▒ ",
        "▒▒▒        ▒▒▒  ▒▒▒  ▒▒▒       ▒▒▒▒▒▒▒▒   ▒▒▒▒▒▒ ",
        "▒▒▒        ▒▒▒  ▒▒▒  ▒▒▒       ▒▒▒  ▒▒▒       ▒▒▒",
        "▒▒▒        ▒▒▒  ▒▒▒  ▒▒▒       ▒▒▒  ▒▒▒       ▒▒▒",
        "▒▒▒▒▒▒▒▒   ▒▒▒▒▒▒    ▒▒▒▒▒▒   ▒▒▒  ▒▒▒   ▒▒▒▒▒▒ ",
        "▒▒▒▒▒▒▒▒   ▒▒▒▒▒▒    ▒▒▒▒▒▒   ▒▒▒  ▒▒▒   ▒▒▒▒▒▒ "
    ]
    return "\n".join(patterns)

def create_ultra_compact_ascii():
    """Create ultra-compact ASCII for very small screens"""
    patterns = [
        "█  █ █ ███ ███ ███",
        "█  █ █ █   █ █ █  ",
        "███ ███ ███ ███ ███"
    ]
    return "\n".join(patterns)

def main():
    print("Generating responsive ASCII art for LUCAS...")
    
    # Save mobile version
    mobile_art = create_mobile_ascii()
    with open('lucas_ascii_mobile.txt', 'w') as f:
        f.write(mobile_art)
    print("\nMobile version:")
    print(mobile_art)
    
    # Save tablet version
    tablet_art = create_tablet_ascii()
    with open('lucas_ascii_tablet.txt', 'w') as f:
        f.write(tablet_art)
    print("\nTablet version:")
    print(tablet_art)
    
    # Save desktop version
    desktop_art = create_desktop_ascii()
    with open('lucas_ascii_desktop.txt', 'w') as f:
        f.write(desktop_art)
    print("\nDesktop version:")
    print(desktop_art)
    
    # Save ultra-compact version
    ultra_art = create_ultra_compact_ascii()
    with open('lucas_ascii_ultra.txt', 'w') as f:
        f.write(ultra_art)
    print("\nUltra-compact version:")
    print(ultra_art)
    
    print("\nAll versions saved successfully!")

if __name__ == "__main__":
    main()