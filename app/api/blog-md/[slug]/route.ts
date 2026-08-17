import { blogPosts, isPostPublished } from "../../../data/blog";
import { renderBlogPostMarkdown } from "../../../lib/markdown";

export const dynamic = "force-static";

/**
 * Serves a single published blog post as Markdown.
 *
 * Reached via the `/blog/:slug.md` rewrite in next.config.mjs — Next.js route
 * segments can't carry a file extension, so the pretty URL is rewritten here.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post || !isPostPublished(post)) {
    return new Response("Not found\n", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  return new Response(renderBlogPostMarkdown(post), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control":
        "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
      "X-Robots-Tag": "index, follow",
    },
  });
}

export function generateStaticParams() {
  return blogPosts.filter(isPostPublished).map((post) => ({ slug: post.slug }));
}
