/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      // Agent-readable Markdown for each post. Route segments can't carry a
      // file extension, so `/blog/my-post.md` is rewritten to the handler.
      {
        source: "/blog/:slug.md",
        destination: "/api/blog-md/:slug",
      },
    ];
  },
}

export default nextConfig
