'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import type { Venue } from '@/types/venue';
import type { BoundingBox } from '@/types/venue';
import { MapBoundsController } from './MapBoundsController';
import { VenueMarkersCluster } from './VenueMarkersCluster';

// Mặc định focus vào Hà Nội
const DEFAULT_CENTER: [number, number] = [21.0285, 105.8542];
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
  const [mapKey, setMapKey] = useState<number | null>(null);

  // Tránh "Map container is already initialized": render map sau delay để qua double-mount (Strict Mode / hot reload)
  useEffect(() => {
    const t = setTimeout(() => setMapKey(Date.now()), 100);
    return () => clearTimeout(t);
  }, []);

  if (mapKey === null) {
    return (
      <div className="flex h-full min-h-[400px] w-full items-center justify-center rounded-lg bg-slate-100">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <MapContainer
      key={mapKey}
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
      <VenueMarkersCluster
        venues={venues}
        selectedVenueId={selectedVenueId}
        onVenueSelect={onVenueSelect}
      />
    </MapContainer>
  );
}
