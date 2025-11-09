'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface Podcast {
  name: string;
  spotifyId: string;
  imageUrl?: string | null;
}

interface PodcastCarouselV2Props {
  podcasts: Podcast[];
  className?: string;
}

/**
 * PodcastCarouselV2 - 2-column layout with selected podcast player on left
 * and vertical scrollable list on right
 */
export function PodcastCarouselV2({ podcasts, className }: PodcastCarouselV2Props) {
  const [selectedPodcastId, setSelectedPodcastId] = useState(podcasts[0]?.spotifyId || '');
  const selectedPodcast = podcasts.find((p) => p.spotifyId === selectedPodcastId);

  return (
    <div className={cn('w-full', className)}>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left column: Selected Podcast Player */}
        <div className="lg:col-span-3">
          {selectedPodcast ? (
            <div className="sticky top-4">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Spotify Embed */}
                <div className="w-full">
                  <iframe
                    src={`https://open.spotify.com/embed/show/${selectedPodcast.spotifyId}?utm_source=generator`}
                    width="100%"
                    height="352"
                    frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    title={`Spotify embed for ${selectedPodcast.name}`}
                    className="w-full"
                  ></iframe>
                </div>

                {/* Podcast Info */}
                <div className="p-4 border-t border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900 line-clamp-2">
                    {selectedPodcast.name}
                  </h3>
                  <p className="text-sm text-slate-500 mt-2">
                    Click on a podcast from the list to preview
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-100 rounded-lg p-6 text-center">
              <p className="text-slate-600">No podcast selected</p>
            </div>
          )}
        </div>

        {/* Right column: Podcast List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <h3 className="font-semibold text-slate-900">Audio Knowledge: Ear & Time Input Constrained</h3>
              <p className="text-xs text-slate-500 mt-1">{podcasts.length} shows</p>
            </div>

            {/* Scrollable List */}
            <div className="overflow-y-auto flex-1 max-h-[500px]">
              {podcasts.map((podcast, index) => (
                <button
                  key={`${podcast.spotifyId}-${podcast.name}-${index}`}
                  onClick={() => setSelectedPodcastId(podcast.spotifyId)}
                  className={cn(
                    'w-full text-left px-4 py-3 border-b border-slate-100 transition-colors hover:bg-slate-50 flex items-center gap-3',
                    selectedPodcastId === podcast.spotifyId
                      ? 'bg-blue-50 border-l-4 border-l-blue-500'
                      : 'hover:bg-slate-50'
                  )}
                >
                  {/* Podcast thumbnail */}
                  {podcast.imageUrl ? (
                    <img
                      src={podcast.imageUrl}
                      alt={`${podcast.name} artwork`}
                      className="flex-shrink-0 w-12 h-12 rounded object-cover"
                    />
                  ) : (
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded flex items-center justify-center text-white text-xs font-bold">
                      {podcast.name.charAt(0).toUpperCase()}
                    </div>
                  )}

                  {/* Podcast info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 line-clamp-2">
                      {podcast.name}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      Podcast
                    </p>
                  </div>

                  {/* Selection indicator */}
                  {selectedPodcastId === podcast.spotifyId && (
                    <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
