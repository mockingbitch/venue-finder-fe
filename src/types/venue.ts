export interface Venue {
  id: string;
  name: string;
  description?: string;
  address?: string;
  latitude: number;
  longitude: number;
  capacity?: number;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface VenueCreateInput {
  name: string;
  description?: string;
  address?: string;
  latitude: number;
  longitude: number;
  capacity?: number;
  imageUrl?: string;
}

export interface VenueUpdateInput extends Partial<VenueCreateInput> {
  id: string;
}

export interface BoundingBox {
  north: number;  // northEast.lat
  south: number;  // southWest.lat
  east: number;   // northEast.lng
  west: number;   // southWest.lng
}

/** Extracts bounding box from Leaflet LatLngBounds (getNorthEast/getSouthWest) */
export function boundsFromLeaflet(bounds: {
  getNorthEast: () => { lat: number; lng: number };
  getSouthWest: () => { lat: number; lng: number };
}): BoundingBox {
  const ne = bounds.getNorthEast();
  const sw = bounds.getSouthWest();
  return {
    north: Number(ne?.lat ?? 0),
    south: Number(sw?.lat ?? 0),
    east: Number(ne?.lng ?? 0),
    west: Number(sw?.lng ?? 0),
  };
}
