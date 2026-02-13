'use client';

import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
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

interface VenueMarkerProps {
  venue: Venue;
  isSelected: boolean;
  onClick: () => void;
}

export function VenueMarker({ venue, isSelected, onClick }: VenueMarkerProps) {
  const lat = Number(venue.latitude);
  const lng = Number(venue.longitude);
  if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
  const position: [number, number] = [lat, lng];

  return (
    <Marker
      position={position}
      icon={isSelected ? selectedIcon : defaultIcon}
      eventHandlers={{ click: onClick }}
    >
      <Popup>
        <div className="p-1 min-w-[140px]">
          <h3 className="font-semibold text-slate-800">{venue.name}</h3>
          {venue.address && (
            <p className="text-sm text-slate-600 mt-1">{venue.address}</p>
          )}
        </div>
      </Popup>
    </Marker>
  );
}
