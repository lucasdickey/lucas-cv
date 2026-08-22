'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useViewMode } from '../contexts/view-mode-context';

export interface HostedVideo {
  name: string;
  title: string;
  href: string;
  bytes: number;
  modified: string;
}

const formatSize = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;

/**
 * Renders the unlisted video index in whichever presentation the site is in.
 *
 * Split from the route because the file listing is read off disk at build time
 * on the server, while the presentation comes from a client context.
 */
export default function VideoIndex({ videos }: { videos: HostedVideo[] }) {
  const { viewMode } = useViewMode();
  const marketer = viewMode === 'marketer';

  const shell = marketer
    ? 'min-h-screen bg-white marketer-view'
    : 'min-h-screen bg-[#f5f5dc] text-[#333333] font-mono';
  const card = marketer
    ? 'rounded-lg border border-[#DFE1E6] bg-[#F4F5F7] p-5'
    : 'rounded-md border border-[#cccccc] bg-[#f0f0e0] p-4';
  const heading = marketer ? 'text-[#172B4D]' : 'text-[#8b0000]';
  const muted = marketer ? 'text-[#6B778C]' : 'text-[#666666]';
  const link = marketer ? 'text-[#0052CC]' : 'text-[#0000ff]';

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
                <h2 className={`text-lg font-bold ${marketer ? 'text-[#172B4D]' : 'text-[#333333]'}`}>
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
