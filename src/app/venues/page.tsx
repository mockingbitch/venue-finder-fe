'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useVenues } from '@/hooks/useVenues';
import { VenueMap } from '@/components/map/VenueMap';
import { VenueCard } from '@/components/venues/VenueCard';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import type { Venue } from '@/types/venue';
import type { BoundingBox } from '@/types/venue';
import Link from 'next/link';

const DEFAULT_BOUNDS: BoundingBox = {
  north: 51.6,
  south: 51.4,
  east: -0.05,
  west: -0.2,
};

export default function VenuesPage() {
  const [bounds, setBounds] = useState<BoundingBox | null>(DEFAULT_BOUNDS);
  const [selectedVenueId, setSelectedVenueId] = useState<string | null>(null);
  const cardRefsRef = useRef<Map<string, HTMLButtonElement>>(new Map());
  const listContainerRef = useRef<HTMLDivElement>(null);

  const { data: venues = [], isLoading, isFetching, error } = useVenues(bounds);

  const handleBoundsChange = useCallback((newBounds: BoundingBox) => {
    setBounds(newBounds);
  }, []);

  const handleVenueSelect = useCallback((venue: Venue | null) => {
    setSelectedVenueId(venue?.id ?? null);
  }, []);

  // Scroll selected card into view when selection changes (e.g. marker clicked)
  useEffect(() => {
    if (!selectedVenueId || !listContainerRef.current) return;
    const cardEl = cardRefsRef.current.get(selectedVenueId);
    if (cardEl) {
      cardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [selectedVenueId]);

  const setCardRef = useCallback((id: string, el: HTMLButtonElement | null) => {
    if (el) {
      cardRefsRef.current.set(id, el);
    } else {
      cardRefsRef.current.delete(id);
    }
  }, []);

  return (
    <ErrorBoundary>
    <main className="min-h-screen bg-slate-50">
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-full items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-xl font-bold text-slate-900">
            Venue Finder
          </Link>
          <div className="flex gap-4">
            <Link
              href="/venues"
              className="rounded-lg px-4 py-2 text-sm font-medium text-primary-600"
            >
              Venues
            </Link>
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Login
            </Link>
            <Link
              href="/admin/dashboard"
              className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
            >
              Admin
            </Link>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-full px-4 py-6 sm:px-6 lg:px-8">
        <h1 className="mb-6 text-2xl font-bold text-slate-900">Venues</h1>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="relative lg:col-span-2">
            <VenueMap
              venues={venues}
              selectedVenueId={selectedVenueId}
              onVenueSelect={handleVenueSelect}
              onBoundsChange={handleBoundsChange}
              isFetching={isFetching}
            />
          </div>

          <div
            ref={listContainerRef}
            className="flex flex-col gap-4"
          >
            {isLoading ? (
              <VenueListSkeleton />
            ) : error ? (
              <p className="text-red-600">
                Failed to load venues. Ensure the API is running.
              </p>
            ) : venues.length === 0 ? (
              <p className="text-slate-600">
                No venues in this area. Try moving the map.
              </p>
            ) : (
              <div className="space-y-3 overflow-y-auto pr-2 max-h-[600px]">
                {venues.map((venue) => (
                  <VenueCard
                    key={venue.id}
                    ref={(el) => setCardRef(venue.id, el)}
                    venue={venue}
                    isSelected={selectedVenueId === venue.id}
                    onClick={() => handleVenueSelect(venue)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
    </ErrorBoundary>
  );
}

function VenueListSkeleton() {
  return (
    <div className="space-y-3 pr-2">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="animate-pulse rounded-lg border-2 border-slate-200 bg-white p-4"
        >
          <div className="h-5 w-3/4 rounded bg-slate-200" />
          <div className="mt-2 h-4 w-1/2 rounded bg-slate-100" />
          <div className="mt-2 h-4 w-full rounded bg-slate-100" />
        </div>
      ))}
    </div>
  );
}
