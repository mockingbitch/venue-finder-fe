'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import type { Venue } from '@/types/venue';
import type { BoundingBox } from '@/types/venue';
import { MapBoundsController } from './MapBoundsController';
import { VenueMarker } from './VenueMarker';

const DEFAULT_CENTER: [number, number] = [51.505, -0.09];
const DEFAULT_ZOOM = 13;

interface VenueMapInnerProps {
  venues: Venue[];
  selectedVenueId: string | null;
  onVenueSelect: (venue: Venue | null) => void;
  onBoundsChange: (bounds: BoundingBox) => void;
}

export default function VenueMapInner({
  venues,
  selectedVenueId,
  onVenueSelect,
  onBoundsChange,
}: VenueMapInnerProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="flex h-full min-h-[400px] w-full items-center justify-center rounded-lg bg-slate-100">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <MapContainer
      center={DEFAULT_CENTER}
      zoom={DEFAULT_ZOOM}
      className="h-full w-full"
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapBoundsController onBoundsChange={onBoundsChange} />
      {venues.map((venue) => (
        <VenueMarker
          key={venue.id}
          venue={venue}
          isSelected={selectedVenueId === venue.id}
          onClick={() => onVenueSelect(venue)}
        />
      ))}
    </MapContainer>
  );
}
