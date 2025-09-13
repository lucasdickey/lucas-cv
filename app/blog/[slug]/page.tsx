import Link from 'next/link';
import { blogPosts, isPostPublished, getPublishedPosts } from '../../data/blog';
import type { Metadata } from "next";
import { notFound } from 'next/navigation';

// Force dynamic rendering to check dates at request time
export const dynamic = 'force-dynamic';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  // Generate static params for all posts, but they'll be filtered at runtime
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((post) => post.slug === slug);

  if (!post || !isPostPublished(post)) {
    return {
      title: 'Post Not Found - Lucas Dickey',
      description: 'The requested blog post could not be found.',
    };
  }

  return {
    title: `${post.title} - Lucas Dickey`,
    description: post.excerpt,
    openGraph: {
      title: `${post.title} - Lucas Dickey`,
      description: post.excerpt,
      url: `https://lucas.cv/blog/${post.slug}`,
      siteName: "Lucas Dickey CV",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      locale: "en_US",
      type: "article",
      publishedTime: post.publishedDate,
      authors: ["Lucas Dickey"],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} - Lucas Dickey`,
      description: post.excerpt,
      images: ["/og-image.png"],
      creator: "@lucasdickey4",
      site: "@lucasdickey4",
    },
    authors: [{ name: "Lucas Dickey", url: "https://lucas.cv" }],
    creator: "Lucas Dickey",
    publisher: "Lucas Dickey",
    keywords: post.tags,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = blogPosts.find((post) => post.slug === slug);

  if (!post || !isPostPublished(post)) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const processMarkdownLinks = (text: string) => {
    if (!text.includes('[') || !text.includes('](')) {
      return text;
    }
    
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;
    
    while ((match = linkRegex.exec(text)) !== null) {
      // Add text before the link
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      // Add the link
      parts.push(
        <a 
          key={match.index} 
          href={match[2]} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-[#0000ff] hover:underline"
        >
          {match[1]}
        </a>
      );
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }
    
    return parts;
  };

  const formatContent = (content: string) => {
    return content
      .split('\n')
      .map((line, index) => {
        // Handle headers
        if (line.startsWith('# ')) {
          return (
            <h1 key={index} className="text-2xl font-bold text-[#8b0000] mb-4 mt-6 first:mt-0">
              {line.replace('# ', '')}
            </h1>
          );
        }
        if (line.startsWith('## ')) {
          return (
            <h2 key={index} className="text-xl font-bold text-[#8b0000] mb-3 mt-5">
              {line.replace('## ', '')}
            </h2>
          );
        }
        if (line.startsWith('### ')) {
          return (
            <h3 key={index} className="text-lg font-bold text-[#333333] mb-2 mt-4">
              {line.replace('### ', '')}
            </h3>
          );
        }
        
        // Handle code blocks
        if (line.startsWith('```')) {
          return null; // Handle in pairs
        }
        
        // Handle list items
        if (line.startsWith('- ')) {
          const listText = line.replace('- ', '');
          // Check for bold text within list items
          if (listText.includes('**')) {
            const parts = listText.split('**');
            const formattedText = parts.map((part, i) => 
              i % 2 === 1 ? <strong key={i} className="font-bold">{part}</strong> : part
            );
            return (
              <li key={index} className="ml-4 mb-1 text-[#333333] leading-relaxed">
                {formattedText}
              </li>
            );
          }
          return (
            <li key={index} className="ml-4 mb-1 text-[#333333] leading-relaxed">
              {listText}
            </li>
          );
        }
        
        // Handle numbered lists
        const numberedMatch = line.match(/^\d+\.\s/);
        if (numberedMatch) {
          const listText = line.replace(/^\d+\.\s/, '');
          // Check for bold text within numbered list items
          if (listText.includes('**')) {
            const parts = listText.split('**');
            const formattedText = parts.map((part, i) => 
              i % 2 === 1 ? <strong key={i} className="font-bold">{part}</strong> : part
            );
            return (
              <li key={index} className="ml-4 mb-1 text-[#333333] leading-relaxed list-decimal">
                {formattedText}
              </li>
            );
          }
          return (
            <li key={index} className="ml-4 mb-1 text-[#333333] leading-relaxed list-decimal">
              {listText}
            </li>
          );
        }
        
        // Handle horizontal rules
        if (line.trim() === '---') {
          return (
            <hr key={index} className="my-6 border-t border-[#cccccc]" />
          );
        }
        
        // Handle author attribution (italic text starting with *)
        if (line.startsWith('*') && line.endsWith('*') && !line.includes('**')) {
          const content = line.slice(1, -1);
          const processedContent = processMarkdownLinks(content);
          
          return (
            <p key={index} className="mb-4 text-[#8b0000] italic font-medium text-center bg-[#f0f0e0] p-3 rounded border">
              {processedContent}
            </p>
          );
        }
        
        // Handle bold text with **
        if (line.includes('**')) {
          const parts = line.split('**');
          const formattedLine = parts.map((part, i) => 
            i % 2 === 1 ? <strong key={i} className="font-bold">{part}</strong> : part
          );
          return (
            <p key={index} className="mb-4 text-[#333333] leading-relaxed">
              {formattedLine}
            </p>
          );
        }
        
        // Handle italic text with single *
        if (line.includes('*') && !line.includes('**')) {
          const parts = line.split('*');
          const formattedLine = parts.map((part, i) => 
            i % 2 === 1 ? <em key={i} className="italic">{part}</em> : part
          );
          return (
            <p key={index} className="mb-4 text-[#333333] leading-relaxed">
              {formattedLine}
            </p>
          );
        }
        
        // Handle inline code with backticks
        if (line.includes('`') && !line.startsWith('```')) {
          const parts = line.split('`');
          const formattedLine = parts.map((part, i) => 
            i % 2 === 1 ? 
              <code key={i} className="bg-[#e0e0d0] px-1 py-0.5 rounded text-sm font-mono">
                {part}
              </code> : part
          );
          return (
            <p key={index} className="mb-4 text-[#333333] leading-relaxed">
              {formattedLine}
            </p>
          );
        }
        
        // Empty lines
        if (line.trim() === '') {
          return null;
        }
        
        // Regular paragraphs
        const processedLine = processMarkdownLinks(line);
        return (
          <p key={index} className="mb-4 text-[#333333] leading-relaxed">
            {processedLine}
          </p>
        );
      })
      .filter(Boolean);
  };

  return (
    <div className="min-h-screen bg-[#f5f5dc] text-[#333333] font-mono p-5">
      {/* Terminal Header */}
      <div className="border border-[#cccccc] bg-[#e8e8d8] p-2 md:p-4 mb-5 rounded-md shadow-sm">
        <div className="flex items-center mb-2">
          <div className="w-3 h-3 rounded-full bg-[#ff6057] mr-2"></div>
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e] mr-2"></div>
          <div className="w-3 h-3 rounded-full bg-[#28ca41]"></div>
          <div className="ml-4 text-[#666666] text-sm">terminal — bash</div>
        </div>
        <div className="text-[#333333] mb-1">
          <Link href="/" className="text-[#0000ff] hover:underline">
            <span className="text-[#8b0000]">$</span> cd ../../
          </Link>
        </div>
        <div className="text-[#333333] mb-1">
          <Link href="/blog" className="text-[#0000ff] hover:underline">
            <span className="text-[#8b0000]">$</span> cd blog/
          </Link>
        </div>
        <div className="text-[#333333] mb-1">
          <span className="text-[#8b0000]">$</span> cat {post.slug}.md
        </div>
      </div>

      {/* Post Header */}
      <div className="border border-[#cccccc] bg-[#f0f0e0] p-6 mb-5 rounded-md shadow-sm">
        <h1 className="text-3xl font-bold text-[#8b0000] mb-4">{post.title}</h1>
        
        <div className="flex flex-wrap items-center gap-4 text-sm text-[#666666] mb-4">
          <span>Published {formatDate(post.publishedDate)}</span>
          <span>•</span>
          <span>{post.readTime} minute read</span>
          <span>•</span>
          <span>By Lucas Dickey</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-[#e0e0d0] text-[#666666] px-2 py-1 rounded border"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Post Content */}
      <article className="border border-[#cccccc] bg-[#f5f5dc] p-6 mb-5 rounded-md shadow-sm">
        <div className="prose prose-terminal max-w-none">
          {formatContent(post.content)}
        </div>
      </article>

      {/* Footer Navigation */}
      <div className="border border-[#cccccc] bg-[#f0f0e0] p-4 rounded-md shadow-sm">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <Link
            href="/blog"
            className="text-[#0000ff] hover:underline text-sm"
          >
            ← Back to all posts
          </Link>
          
          <div className="flex gap-4">
            <Link
              href="/"
              className="text-[#0000ff] hover:underline text-sm"
            >
              Home
            </Link>
            <span className="text-[#666666]">•</span>
            <a
              href="https://twitter.com/lucasdickey4"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0000ff] hover:underline text-sm"
            >
              Discuss on Twitter
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}