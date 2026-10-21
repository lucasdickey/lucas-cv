import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export interface HostedVideo {
  name: string;
  title: string;
  href: string;
  bytes: number;
  modified: string;
}

const formatSize = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;

/**
 * Renders the unlisted video index. The route reads the file listing off disk
 * at build time and hands it here.
 */
export default function VideoIndex({ videos }: { videos: HostedVideo[] }) {
  const shell = 'min-h-screen bg-[#f5f5dc] text-[#333333] font-mono';
  const card = 'rounded-md border border-[#cccccc] bg-[#f0f0e0] p-4';
  const heading = 'text-[#8b0000]';
  const muted = 'text-[#666666]';
  const link = 'text-[#0000ff]';

  return (
    <div className={shell}>
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href="/"
          className={`mb-4 inline-flex items-center gap-2 text-sm font-medium ${link}`}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to home</span>
        </Link>

        <h1 className={`text-3xl font-bold ${heading}`}>Videos</h1>
        <p className={`mt-2 text-sm ${muted}`}>
          {videos.length === 0
            ? 'Nothing hosted yet.'
            : `${videos.length} file${videos.length === 1 ? '' : 's'} served from /video/. This page is unlisted — it is not in the sitemap or the navigation.`}
        </p>

        <ul className="mt-8 space-y-6">
          {videos.map((video) => (
            <li key={video.name} className={card}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h2 className="text-lg font-bold text-[#333333]">
                  {video.title}
                </h2>
                <span className={`text-xs ${muted}`}>
                  {formatSize(video.bytes)} · {video.modified}
                </span>
              </div>

              <video
                controls
                preload="metadata"
                className="mt-3 w-full max-w-xl rounded"
                style={{ background: '#000' }}
              >
                <source src={video.href} type="video/mp4" />
                Your browser cannot play this file.{' '}
                <a href={video.href}>Download it instead.</a>
              </video>

              <div className={`mt-3 break-all font-mono text-xs ${muted}`}>
                <a
                  href={video.href}
                  className={link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {video.href}
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
