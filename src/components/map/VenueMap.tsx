'use client';

import { useCallback } from 'react';
import dynamic from 'next/dynamic';
import type { Venue } from '@/types/venue';
import type { BoundingBox } from '@/types/venue';

const MapInner = dynamic(() => import('./VenueMapInner'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[400px] w-full items-center justify-center rounded-lg bg-slate-100">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
    </div>
  ),
});

interface VenueMapProps {
  venues: Venue[];
  selectedVenueId: string | null;
  onVenueSelect: (venue: Venue | null) => void;
  onBoundsChange: (bounds: BoundingBox) => void;
  isFetching?: boolean;
}

export function VenueMap({
  venues,
  selectedVenueId,
  onVenueSelect,
  onBoundsChange,
  isFetching = false,
}: VenueMapProps) {
  const handleBoundsChange = useCallback(
    (bounds: BoundingBox) => onBoundsChange(bounds),
    [onBoundsChange]
  );

  return (
    <div className="relative h-full min-h-[400px] w-full overflow-hidden rounded-lg border border-slate-200 shadow-sm">
      <MapInner
        venues={venues}
        selectedVenueId={selectedVenueId}
        onVenueSelect={onVenueSelect}
        onBoundsChange={handleBoundsChange}
      />
      {isFetching && (
        <div
          className="absolute inset-0 z-[1000] flex items-center justify-center bg-white/60 backdrop-blur-[1px]"
          aria-label="Loading venues"
        >
          <div className="h-9 w-9 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
        </div>
      )}
    </div>
  );
}
