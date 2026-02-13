'use client';

import { forwardRef } from 'react';
import type { Venue } from '@/types/venue';

interface VenueCardProps {
  venue: Venue;
  isSelected: boolean;
  onClick: () => void;
}

export const VenueCard = forwardRef<HTMLButtonElement, VenueCardProps>(
  function VenueCard({ venue, isSelected, onClick }, ref) {
    return (
      <button
        ref={ref}
        type="button"
        onClick={onClick}
        data-venue-id={venue.id}
        aria-pressed={isSelected}
        className={`w-full rounded-lg border-2 p-4 text-left transition-all scroll-mt-4 ${
          isSelected
            ? 'border-primary-500 bg-primary-50 shadow-md'
            : 'border-slate-200 bg-white hover:border-primary-300 hover:bg-slate-50'
        }`}
    >
      <h3 className="font-semibold text-slate-900">{venue.name}</h3>
      {venue.address && (
        <p className="mt-1 text-sm text-slate-600">{venue.address}</p>
      )}
      {venue.description && (
        <p className="mt-2 line-clamp-2 text-sm text-slate-500">
          {venue.description}
        </p>
      )}
      {venue.capacity && (
        <p className="mt-2 text-xs text-slate-400">Capacity: {venue.capacity}</p>
      )}
      </button>
    );
  }
);
