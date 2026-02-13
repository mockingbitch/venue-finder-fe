'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useMap } from 'react-leaflet';
import { boundsFromLeaflet } from '@/types/venue';
import type { BoundingBox } from '@/types/venue';
import { debounce } from '@/lib/utils';

const BOUNDS_DEBOUNCE_MS = 400;

interface MapBoundsControllerProps {
  onBoundsChange: (bounds: BoundingBox) => void;
}

/**
 * Listens to map move/zoom events, extracts bounds via getNorthEast/getSouthWest,
 * debounces updates, and calls the API with the bounding box.
 */
export function MapBoundsController({ onBoundsChange }: MapBoundsControllerProps) {
  const map = useMap();
  const debouncedEmitRef = useRef(
    debounce((bounds: BoundingBox) => onBoundsChange(bounds), BOUNDS_DEBOUNCE_MS)
  );

  const emitBounds = useCallback(() => {
    try {
      const leafletBounds = map.getBounds();
      const bounds = boundsFromLeaflet(leafletBounds);
      debouncedEmitRef.current(bounds);
    } catch {
      // Map may not be ready yet
    }
  }, [map]);

  useEffect(() => {
    debouncedEmitRef.current = debounce(
      (bounds: BoundingBox) => onBoundsChange(bounds),
      BOUNDS_DEBOUNCE_MS
    );
  }, [onBoundsChange]);

  useEffect(() => {
    map.on('moveend', emitBounds);
    map.on('zoomend', emitBounds);
    // Defer initial bounds so map is fully ready
    const id = setTimeout(emitBounds, 0);

    return () => {
      clearTimeout(id);
      map.off('moveend', emitBounds);
      map.off('zoomend', emitBounds);
    };
  }, [map, emitBounds]);

  return null;
}
