'use client';

import React, { useRef, useState, useEffect } from 'react';
import EmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Podcast {
  name: string;
  spotifyId: string;
}

interface PodcastCarouselProps {
  podcasts: Podcast[];
  className?: string;
}

export function PodcastCarousel({ podcasts, className }: PodcastCarouselProps) {
  const [emblaRef, emblaApi] = EmblaCarousel(
    {
      align: 'start',
      slidesToScroll: 1,
      skipSnaps: false,
      containScroll: 'trimSnaps',
      loop: false,
    },
    []
  );

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };

    emblaApi.on('init', onSelect);
    emblaApi.on('reInit', onSelect);
    emblaApi.on('select', onSelect);

    return () => {
      emblaApi.off('init', onSelect);
      emblaApi.off('reInit', onSelect);
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  return (
    <div className={cn('w-full', className)}>
      <div className="relative">
        {/* Carousel viewport */}
        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex gap-6">
            {podcasts.map((podcast) => (
              <div
                key={podcast.spotifyId}
                className="min-w-full md:min-w-[50%] lg:min-w-[33.333%] flex-shrink-0 px-4"
              >
                <PodcastCard podcast={podcast} />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex gap-2 mt-6 justify-center md:justify-start">
          <button
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            className={cn(
              'p-2 rounded-lg border transition-colors',
              canScrollPrev
                ? 'border-slate-300 hover:bg-slate-100 text-slate-700'
                : 'border-slate-200 text-slate-400 cursor-not-allowed bg-slate-50'
            )}
            aria-label="Previous podcasts"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={scrollNext}
            disabled={!canScrollNext}
            className={cn(
              'p-2 rounded-lg border transition-colors',
              canScrollNext
                ? 'border-slate-300 hover:bg-slate-100 text-slate-700'
                : 'border-slate-200 text-slate-400 cursor-not-allowed bg-slate-50'
            )}
            aria-label="Next podcasts"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Scroll indicator (mobile) */}
        <div className="md:hidden text-center mt-4 text-sm text-slate-500">
          Swipe or use arrows to browse
        </div>
      </div>
    </div>
  );
}

interface PodcastCardProps {
  podcast: Podcast;
}

function PodcastCard({ podcast }: PodcastCardProps) {
  return (
    <div className="flex flex-col items-center gap-4 p-4">
      {/* Podcast title */}
      <h3 className="text-center text-sm md:text-base font-semibold text-slate-900 line-clamp-2">
        {podcast.name}
      </h3>

      {/* Spotify embed iframe */}
      <div className="w-full max-w-sm">
        <iframe
          src={`https://open.spotify.com/embed/show/${podcast.spotifyId}?utm_source=generator`}
          width="100%"
          height="352"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          className="rounded-lg"
          title={`Spotify embed for ${podcast.name}`}
        ></iframe>
      </div>
    </div>
  );
}
