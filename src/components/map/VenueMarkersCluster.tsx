'use client';

import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.markercluster';
import type { Venue } from '@/types/venue';

const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const selectedIcon = L.divIcon({
  className: 'selected-marker',
  html: `
    <div style="
      width: 36px;
      height: 36px;
      background: #2563eb;
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    "></div>
  `,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

interface VenueMarkersClusterProps {
  venues: Venue[];
  selectedVenueId: string | null;
  onVenueSelect: (venue: Venue | null) => void;
}

/**
 * Renders venues as clustered markers using Leaflet's MarkerClusterGroup.
 * Uses useMap() so it must be a direct child of MapContainer (no context issue).
 */
export function VenueMarkersCluster({
  venues,
  selectedVenueId,
  onVenueSelect,
}: VenueMarkersClusterProps) {
  const map = useMap();
  const clusterRef = useRef<L.MarkerClusterGroup | null>(null);

  useEffect(() => {
    if (!map) return;

    const cluster = new L.MarkerClusterGroup();
    clusterRef.current = cluster;
    map.addLayer(cluster);

    return () => {
      map.removeLayer(cluster);
      clusterRef.current = null;
    };
  }, [map]);

  useEffect(() => {
    const cluster = clusterRef.current;
    if (!cluster) return;

    cluster.clearLayers();

    for (const venue of venues) {
      const lat = Number(venue.latitude);
      const lng = Number(venue.longitude);
      if (Number.isNaN(lat) || Number.isNaN(lng)) continue;

      const isSelected = selectedVenueId === venue.id;
      const marker = L.marker([lat, lng], {
        icon: isSelected ? selectedIcon : defaultIcon,
      });

      const popupContent = `
        <div class="p-1 min-w-[140px]">
          <h3 class="font-semibold text-slate-800">${escapeHtml(venue.name)}</h3>
          ${venue.address ? `<p class="text-sm text-slate-600 mt-1">${escapeHtml(venue.address)}</p>` : ''}
        </div>
      `;
      marker.bindPopup(popupContent);

      marker.on('click', () => onVenueSelect(venue));

      cluster.addLayer(marker);
    }
  }, [venues, selectedVenueId, onVenueSelect]);

  return null;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
