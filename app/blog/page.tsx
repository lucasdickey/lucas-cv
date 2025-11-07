'use client';

import Link from 'next/link';
import { getPublishedPosts, BlogPost } from '../data/blog';
import { useViewMode } from '../contexts/view-mode-context';
import { ArrowLeft } from 'lucide-react';

export default function BlogPage() {
  const { viewMode } = useViewMode();
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  let sortedPosts: BlogPost[];
  try {
    sortedPosts = [...getPublishedPosts()].sort(
      (a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
    );
  } catch (error) {
    console.error('Error loading blog posts:', error);
    sortedPosts = [];
  }

  // Marketer view
  if (viewMode === 'marketer') {
    return (
      <div className="min-h-screen bg-white marketer-view">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-[#0052CC] hover:text-[#0065FF] mb-4">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back to home</span>
            </Link>
            <h1 className="text-4xl font-bold text-[#172B4D] mb-3">Latest Insights</h1>
            <p className="text-lg text-[#6B778C]">
              Strategic thinking on startups, AI, and business growth
            </p>
          </div>

          {/* Posts List */}
          <div className="space-y-6">
            {sortedPosts.length === 0 ? (
              <div className="bg-[#F4F5F7] rounded-lg p-8 text-center">
                <p className="text-[#6B778C]">No blog posts found.</p>
              </div>
            ) : (
              sortedPosts.map((post) => (
                <div
                  key={post.slug}
                  className="bg-[#F4F5F7] rounded-lg p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3 flex-wrap gap-2">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-[#0052CC] font-bold text-xl hover:underline"
                    >
                      {post.title}
                    </Link>
                    <div className="flex items-center gap-4 text-sm text-[#6B778C]">
                      <span>{formatDate(post.publishedDate)}</span>
                      <span>{post.readTime} min read</span>
                    </div>
                  </div>

                  <p className="text-[#172B4D] mb-4 leading-relaxed">
                    {post.excerpt}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-white text-[#6B778C] text-xs rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1 text-[#0052CC] font-medium text-sm hover:underline"
                  >
                    Read full post
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  // Terminal view
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
                {post.tags.map((tag: string) => (
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