import fs from 'node:fs';
import path from 'node:path';
import type { Metadata } from 'next';
import VideoIndex, { type HostedVideo } from '../components/VideoIndex';

/**
 * An unlisted index of the videos served out of /public/video.
 *
 * Deliberately not in the sitemap, the nav, or any other page's links, and
 * marked noindex: it is a place to find and copy a file URL, not part of the
 * site's structure. Anyone with the link can still open and share it.
 *
 * The directory is `video` (singular) while the route is `/videos` — the
 * directory name is load-bearing, since /video/<file> URLs are already in
 * circulation, and renaming it would break them.
 */
export const metadata: Metadata = {
  title: 'Videos | Lucas Dickey',
  description: 'Video files hosted on this site.',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-static';

const VIDEO_DIR = path.join(process.cwd(), 'public', 'video');
const EXTENSIONS = new Set(['.mp4', '.webm', '.mov', '.m4v']);

/** Turns `syllabus-square-v2.mp4` into `Syllabus square v2`. */
function titleOf(filename: string): string {
  const stem = filename.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').trim();
  return stem.charAt(0).toUpperCase() + stem.slice(1);
}

function readVideos(): HostedVideo[] {
  let entries: string[];
  try {
    entries = fs.readdirSync(VIDEO_DIR);
  } catch {
    // No directory yet: the page still renders, with nothing in it.
    return [];
  }

  return entries
    .filter((name) => EXTENSIONS.has(path.extname(name).toLowerCase()))
    .map((name) => {
      const { size, mtime } = fs.statSync(path.join(VIDEO_DIR, name));
      return {
        name,
        title: titleOf(name),
        href: `/video/${name}`,
        bytes: size,
        modified: mtime.toISOString().slice(0, 10),
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

export default function VideosPage() {
  return <VideoIndex videos={readVideos()} />;
}
