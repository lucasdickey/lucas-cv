import Link from 'next/link';
import { getPublishedPosts } from '../data/blog';
import type { Metadata } from "next";

// Force dynamic rendering to check dates at request time
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Blog - Lucas Dickey",
  description: "Exploring software development, learning, and technology through the lens of agentic coding and continuous personal growth. Written by Lucas Dickey, product leader and serial founder.",
  openGraph: {
    title: "Blog - Lucas Dickey",
    description: "Exploring software development, learning, and technology through the lens of agentic coding and continuous personal growth. Written by Lucas Dickey, product leader and serial founder.",
    url: "https://lucas.cv/blog",
    siteName: "Lucas Dickey CV",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Lucas Dickey - Blog",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog - Lucas Dickey",
    description: "Exploring software development, learning, and technology through the lens of agentic coding and continuous personal growth. Written by Lucas Dickey, product leader and serial founder.",
    images: ["/og-image.png"],
    creator: "@lucasdickey4",
    site: "@lucasdickey4",
  },
};

export default function BlogPage() {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  let sortedPosts;
  try {
    sortedPosts = [...getPublishedPosts()].sort(
      (a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
    );
  } catch (error) {
    console.error('Error loading blog posts:', error);
    sortedPosts = [];
  }

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
            <span className="text-[#8b0000]">$</span> cd ../
          </Link>
        </div>
        <div className="text-[#333333] mb-1">
          <span className="text-[#8b0000]">$</span> cd blog/
        </div>
        <div className="text-[#333333] mb-1">
          <span className="text-[#8b0000]">$</span> ls -la
        </div>
      </div>

      {/* Blog Header */}
      <div className="border border-[#cccccc] bg-[#f0f0e0] p-4 mb-5 rounded-md shadow-sm">
        <div className="text-[#8b0000] text-2xl font-bold mb-2">📝 Blog</div>
        <div className="text-[#333333] text-sm">
          Exploring software development, learning, and technology through the lens of agentic coding and continuous personal growth. Powered by simple TypeScript files.
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {sortedPosts.length === 0 ? (
          <div className="border border-[#cccccc] bg-[#f5f5dc] rounded-md shadow-sm p-8 text-center">
            <div className="text-[#666666]">No blog posts found.</div>
          </div>
        ) : (
          sortedPosts.map((post) => (
          <div
            key={post.slug}
            className="border border-[#cccccc] bg-[#f5f5dc] rounded-md shadow-sm hover:bg-[#f0f0e0] transition-colors duration-200"
          >
            <div className="p-4">
              {/* Post Header */}
              <div className="flex justify-between items-start mb-3 flex-wrap gap-2">
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-[#0000ff] font-bold text-lg hover:underline"
                >
                  {post.title}
                </Link>
                <div className="flex items-center gap-4 text-sm text-[#666666]">
                  <span className="text-[#8b0000]">{formatDate(post.publishedDate)}</span>
                  <span>{post.readTime} min read</span>
                </div>
              </div>

              {/* Post Excerpt */}
              <div className="text-[#333333] mb-3 leading-relaxed">
                {post.excerpt}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-3">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-[#e0e0d0] text-[#666666] px-2 py-1 rounded border"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Read More Link */}
              <div>
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-[#0000ff] text-sm hover:underline"
                >
                  Read full post →
                </Link>
              </div>
            </div>
          </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-[#666666] text-sm">
        <Link href="/" className="text-[#0000ff] hover:underline">
          ← Back to home
        </Link>
      </div>
    </div>
  );
}