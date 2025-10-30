# Repository Thumbnail Image Specifications

## Overview
This document provides specifications for creating thumbnail images for each code repository entry on the homepage.

## Image Specifications

### Dimensions
- **Width**: 400px
- **Height**: 300px
- **Aspect Ratio**: 4:3
- **Format**: PNG or JPG (PNG recommended for transparency if needed)
- **File Size**: Target < 100KB per image (for optimal loading)

### Design Guidelines
- **Style**: Match the terminal/retro aesthetic of the site
- **Color Palette**:
  - Background: Beige (#f5f5dc) or similar
  - Accents: Dark red (#8b0000) for primary elements
  - Text: Dark gray (#333333)
  - Optional: Use the site's color scheme for consistency
- **Content**:
  - Include project name or logo
  - Visual representation of the project (icon, screenshot, or abstract visual)
  - Keep it simple and recognizable at thumbnail size
- **Borders**: Optional 1px border in #cccccc for definition

### File Naming Convention
Use kebab-case matching the project name:
```
prompt-capture-mcp.png
a-ok-shop.png
ob3-chat.png
self-replicating-art.png
key-to-sleep.png
run-human-run.png
a-ok-audio-news.png
emojis-everywhere.png
vizrepoassist.png
quick-screenshot-annotator.png
breathe-free.png
```

## Directory Structure
```
/public/images/repos/
├── prompt-capture-mcp.png
├── a-ok-shop.png
├── ob3-chat.png
├── self-replicating-art.png
├── key-to-sleep.png
├── run-human-run.png
├── a-ok-audio-news.png
├── emojis-everywhere.png
├── vizrepoassist.png
├── quick-screenshot-annotator.png
└── breathe-free.png
```

## Repository List & Image Ideas

### 1. prompt-capture-mcp
- **Description**: Lightweight prompt logging for Claude Code
- **Image Idea**: Terminal window with log entries, or MCP server icon

### 2. a-ok-shop
- **Description**: AI-generated satire fashion brand
- **Image Idea**: A-OK logo or stylized shopping bag

### 3. ob3-chat (OB3.chat)
- **Description**: Government affairs research tool for HR-1
- **Image Idea**: Chat bubble with document/legislative icon

### 4. self-replicating-art
- **Description**: Generative art with algorithms
- **Image Idea**: Abstract fractal or generative art pattern

### 5. key-to-sleep
- **Description**: Sleep story generator with AI pipeline
- **Image Idea**: Moon, stars, or key icon with sleep theme

### 6. run-human-run
- **Description**: Darkly humorous AI doomerism game
- **Image Idea**: Pixel art human running from apes/robots

### 7. a-ok-audio-news
- **Description**: Automated news podcast generator [WIP]
- **Image Idea**: Microphone with news/audio waves icon

### 8. emojis-everywhere
- **Description**: Mac emoji quick-access utility
- **Image Idea**: Grid of popular emojis or emoji picker interface

### 9. vizrepoassist (VizRepoAssist)
- **Description**: Visual development artifacts capture tool
- **Image Idea**: Camera/screenshot icon with code/git symbols

### 10. quick-screenshot-annotator
- **Description**: Mac screenshot annotation utility
- **Image Idea**: Screenshot with annotation tools/markers

### 11. breathe-free
- **Description**: Guided breathing exercise app
- **Image Idea**: Breathing cycle visualization or zen circle

## Implementation Notes

Once you've created the images and placed them in `/public/images/repos/`:

1. Add the `imageUrl` field to each code repository entry in `app/page.tsx`:
   ```typescript
   {
     title: "prompt-capture-mcp",
     description: "...",
     publishedDate: "2025-10-30",
     type: "code",
     sourceUrl: "https://github.com/lucasdickey/prompt-capture-mcp",
     sourceTitle: "GitHub Repository",
     sourceDescription: "Lightweight prompt logging for Claude Code - 0 stars",
     imageUrl: "/images/repos/prompt-capture-mcp.png", // Add this line
   }
   ```

2. Update the rendering logic to display the images in the repository entries list

## Tools for Image Creation

### Recommended Tools:
- **Figma**: For design and export
- **Canva**: Quick template-based designs
- **DALL-E/Midjourney**: AI-generated visuals
- **Screenshot + Edit**: For web project thumbnails
- **Photoshop/GIMP**: Professional editing

### Quick Generation:
You can use AI tools like DALL-E or Claude to generate simple, retro-styled icons that match the terminal aesthetic of your site.
