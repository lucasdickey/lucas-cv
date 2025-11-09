'use client';

import React, { useState } from 'react';
import { PodcastCarousel } from './PodcastCarousel';
import { PodcastCarouselV2 } from './PodcastCarouselV2';
import { subscribedPodcasts } from '@/src/data/podcasts';
import { cn } from '@/lib/utils';
import { Radio } from 'lucide-react';

interface ListeningSectionProps {
  className?: string;
  maxPodcasts?: number;
  showTitle?: boolean;
  showDescription?: boolean;
  layout?: 'carousel' | 'list';
}

export function ListeningSection({
  className,
  maxPodcasts,
  showTitle = true,
  showDescription = true,
  layout = 'list',
}: ListeningSectionProps) {
  // Optionally limit the number of podcasts displayed
  const podcastsToShow = maxPodcasts
    ? subscribedPodcasts.slice(0, maxPodcasts)
    : subscribedPodcasts;

  return (
    <section
      className={cn(
        'w-full py-12 md:py-16',
        className
      )}
    >
      {showTitle && (
        <div className="mb-8 md:mb-12">
          <div className="flex items-center gap-3 mb-2">
            <Radio size={24} className="text-slate-700" />
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
              Podcast Brain Food
            </h2>
          </div>
          {showDescription && (
            <p className="text-slate-600 mt-2 max-w-2xl">
              A curated collection of {podcastsToShow.length} podcasts that keep me informed about
              technology, business, AI, politics, and more.
            </p>
          )}
        </div>
      )}

      {/* Podcast carousel/list */}
      {layout === 'carousel' ? (
        <PodcastCarousel podcasts={podcastsToShow} />
      ) : (
        <PodcastCarouselV2 podcasts={podcastsToShow} />
      )}
    </section>
  );
}
