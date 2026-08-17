import type { MetadataRoute } from "next";
import { getPublishedPosts } from "./data/blog";
import { SITE_URL } from "./lib/markdown";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/blog", "/books", "/syllabus", "/toys"].map(
    (path) => ({
      url: `${SITE_URL}${path}`,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.7,
    })
  );

  const posts = getPublishedPosts().map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.publishedDate),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...posts];
}
