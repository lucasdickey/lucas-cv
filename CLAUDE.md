# Claude Development Guide for lucas-cv

This document provides guidance for AI assistants (like Claude) working on this project.

## Project Overview

This is a Next.js-based personal website and portfolio for Lucas Dickey, featuring:
- Professional resume/CV
- Blog with multiple view modes (marketer and terminal themes)
- Podcast integration
- Two distinct UI themes that can be toggled

## Blog System

### Architecture

The blog uses a **headless blog system** where all posts are stored as TypeScript objects rather than separate markdown files. This makes the blog easy to manage, version control, and deploy.

**Key Files:**
- `/home/user/lucas-cv/app/data/blog.ts` - All blog posts data and utilities
- `/home/user/lucas-cv/app/blog/page.tsx` - Blog listing page
- `/home/user/lucas-cv/app/blog/[slug]/page.tsx` - Individual blog post pages

### Creating a New Blog Post

#### 1. Blog Post Structure

Each blog post is a TypeScript object with the following structure:

```typescript
{
  slug: string;              // URL-friendly identifier (e.g., "my-new-post")
  title: string;             // Full post title
  excerpt: string;           // Short preview text (1-2 sentences)
  content: string;           // Full content in markdown format
  publishedDate: string;     // Date in YYYY-MM-DD format
  tags: string[];            // Array of topic tags
  readTime: number;          // Estimated reading time in minutes
}
```

#### 2. Adding a New Post

1. Open `/home/user/lucas-cv/app/data/blog.ts`
2. Add a new object to the **beginning** of the `blogPosts` array (newest posts first)
3. Follow the structure shown above
4. Ensure the slug is unique and URL-friendly (lowercase, hyphens for spaces)

**Example:**

```typescript
export const blogPosts: BlogPost[] = [
  {
    slug: "my-new-blog-post",
    title: "My New Blog Post: A Subtitle Here",
    excerpt: "A compelling 1-2 sentence summary that appears on the blog listing page.",
    content: `
# My New Blog Post: A Subtitle Here

## Introduction

Your markdown content goes here...

- Bullet points work
- **Bold** and *italic* text work
- [Links](https://example.com) work
- Inline \`code\` works

## Code Blocks

\`\`\`javascript
const example = "Code blocks work too";
\`\`\`

### Images

<img src="/images/blog-shots/my-image.png" alt="Description" style="width: 100%; max-width: 800px; margin: 20px 0; border-radius: 8px;" />

### Embedded Videos

<iframe width="100%" height="400" style="max-width: 800px; margin: 20px 0; border-radius: 8px;" src="https://www.youtube.com/embed/VIDEO_ID" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-full-screen" allowfullscreen></iframe>

---

*Attribution or footer text in italics*
    `,
    publishedDate: "2025-11-10",
    tags: ["tag1", "tag2", "tag3"],
    readTime: 5
  },
  // ... existing posts follow
];
```

#### 3. Content Guidelines

**Markdown Support:**
- Headers: `#`, `##`, `###`
- Bold: `**text**`
- Italic: `*text*`
- Links: `[text](url)` - automatically open in new tabs
- Lists: `-` or `1.`
- Inline code: `` `code` ``
- Code blocks: ` ```language ... ``` `

**HTML Support:**
- `<img>` tags for images with custom styling
- `<iframe>` for embedded videos
- Use the standard styling shown in the example above

**Best Practices:**
- Keep excerpts concise (1-2 sentences)
- Use descriptive, SEO-friendly titles
- Add relevant tags for categorization
- Calculate read time as ~200 words per minute
- Use the template from existing posts for consistency

#### 4. Publishing Control

**Scheduling Posts:**
- Posts with future dates are automatically hidden
- The `isPostPublished()` function checks if a post's date has passed
- Posts appear automatically on their publish date

**Immediate Publishing:**
- Use today's date or a past date in the `publishedDate` field

#### 5. Images and Assets

**Blog Images:**
- Store in `/public/images/blog-shots/`
- Reference as `/images/blog-shots/filename.png`
- Use descriptive filenames

**Standard Image Template:**
```html
<img src="/images/blog-shots/my-image.png" alt="Descriptive alt text" style="width: 100%; max-width: 800px; margin: 20px 0; border-radius: 8px;" />
```

#### 6. SEO and Metadata

The blog system automatically generates:
- SEO meta tags
- Open Graph tags for social sharing
- Twitter Card metadata
- Dynamic metadata per post

No additional configuration needed—just add the post!

### Common Tags

Use consistent tags across posts. Common tags in this blog:
- `software-development`
- `ai`
- `product-management`
- `product-strategy`
- `learning`
- `career`
- `investing`
- `business-strategy`
- `agentic-coding`
- `technology`

### Testing Your Post

After adding a post:

1. **Development Server:**
   ```bash
   npm run dev
   ```
   Navigate to `http://localhost:3000/blog`

2. **Check:**
   - Post appears on blog listing page
   - Post is sorted correctly by date
   - Individual post page renders at `/blog/[your-slug]`
   - Images and embeds display correctly
   - Tags are visible

3. **Build Test:**
   ```bash
   npm run build
   ```
   Ensure no build errors

### View Modes

The blog supports two view modes:
- **Marketer View**: Professional blue design (Atlassian-inspired)
- **Terminal View**: Retro terminal aesthetic

Both modes use the same blog data—no changes needed to posts.

## Git Workflow

When making changes to this project:

1. **Branch Naming**: Always work on branches starting with `claude/`
2. **Commits**: Use clear, descriptive commit messages
3. **Pushing**: Use `git push -u origin <branch-name>`

**Example workflow for blog posts:**
```bash
git add app/data/blog.ts
git commit -m "feat: Add new blog post about staying close to the metal"
git push -u origin claude/your-branch-name
```

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm start` - Start production server

## Project Structure

```
lucas-cv/
├── app/
│   ├── blog/
│   │   ├── [slug]/
│   │   │   └── page.tsx      # Individual blog post pages
│   │   └── page.tsx           # Blog listing page
│   ├── data/
│   │   └── blog.ts            # Blog posts data
│   └── ...
├── public/
│   └── images/
│       └── blog-shots/        # Blog post images
└── ...
```

## Questions?

For questions about this project or to report issues, refer to the main project documentation or contact the repository owner.
