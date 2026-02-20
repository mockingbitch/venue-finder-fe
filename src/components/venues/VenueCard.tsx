'use client';

import { forwardRef, useState } from 'react';
import type { Venue } from '@/types/venue';

interface VenueCardProps {
  venue: Venue;
  isSelected: boolean;
  onClick: () => void;
}

function PriceRange({ n }: { n?: number }) {
  if (n == null || n < 1) return <span className="text-slate-400">—</span>;
  return <span className="text-slate-700">{'$'.repeat(Math.min(5, Math.max(1, n)))}</span>;
}

export const VenueCard = forwardRef<HTMLDivElement, VenueCardProps>(
  function VenueCard({ venue, isSelected, onClick }, ref) {
    const [favorited, setFavorited] = useState(false);

    const category = venue.category ?? 'Venue';
    const location = venue.address ?? '—';
    const rating = venue.rating ?? 0;
    const reviewCount = venue.reviewCount ?? 0;

    return (
      <div
        ref={ref}
        data-venue-id={venue.id}
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
        aria-pressed={isSelected}
        className={`overflow-hidden rounded-xl border-2 bg-white text-left shadow-sm transition-all scroll-mt-4 ${
          isSelected
            ? 'border-primary-500 ring-2 ring-primary-200'
            : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
        }`}
      >
        {/* Image */}
        <div className="relative aspect-[4/3] w-full bg-slate-100">
          {venue.imageUrl ? (
            <img
              src={venue.imageUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-slate-400">
              <svg className="h-12 w-12" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
              </svg>
            </div>
          )}
          <button
            type="button"
            aria-label={favorited ? 'Bỏ yêu thích' : 'Yêu thích'}
            onClick={(e) => {
              e.stopPropagation();
              setFavorited((v) => !v);
            }}
            className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 shadow-sm transition hover:bg-white"
          >
            <svg
              className={`h-5 w-5 ${favorited ? 'fill-red-500 text-red-500' : 'text-slate-700'}`}
              stroke="currentColor"
              strokeWidth={1.5}
              fill={favorited ? 'currentColor' : 'none'}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </button>
        </div>

        <div className="p-4">
          {/* Title + Request Quote */}
          <div className="flex items-start gap-2">
            <h3 className="min-w-0 flex-1 truncate font-semibold text-slate-900" title={venue.name}>
              {venue.name}
            </h3>
            <button
              type="button"
              onClick={(e) => e.stopPropagation()}
              className="shrink-0 rounded border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Request Quote
            </button>
          </div>

          {/* Category • Location */}
          <p className="mt-1.5 text-sm text-slate-500">
            {category} • {location}
          </p>

          {/* Capacity | Rating | Price */}
          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
            <span className="flex items-center gap-1 text-slate-600">
              <svg className="h-4 w-4 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
              {venue.capacity ?? '—'}
            </span>
            <span className="flex items-center gap-1 text-slate-600">
              <svg className="h-4 w-4 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
              <span className="font-medium text-slate-700">
                {rating > 0 ? rating.toFixed(1) : '—'}
              </span>
              {reviewCount > 0 && (
                <span className="text-slate-400">({reviewCount})</span>
              )}
            </span>
            <PriceRange n={venue.priceRange} />
          </div>
        </div>
      </div>
    );
  }
);
