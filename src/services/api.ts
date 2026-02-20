import { apiClient } from '@/lib/axios';
import { MOCK_VENUES } from '@/data/mockVenues';
import type { Venue, VenueCreateInput, VenueUpdateInput } from '@/types/venue';
import type { BoundingBox } from '@/types/venue';

const VENUES_ENDPOINT = '/venues';
// Default to mock when not explicitly disabled (for dev without backend)
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA !== 'false';

/** API trả về { data: [...] } (Postman Get venues) */
interface VenuesApiResponse {
  data: VenueApi[];
}

/** Venue từ API (có thể lat/lng thay vì latitude/longitude) */
interface VenueApi {
  id: string;
  name: string;
  description?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  lat?: number;
  lng?: number;
  capacity?: number;
  imageUrl?: string;
  images?: string[];
  createdAt?: string;
  updatedAt?: string;
  category?: string;
  rating?: number;
  review_count?: number;
  reviewCount?: number;
  price_range?: number;
  priceRange?: number;
}

function mapApiVenueToVenue(api: VenueApi): Venue {
  const lat = api.latitude ?? api.lat ?? 0;
  const lng = api.longitude ?? api.lng ?? 0;
  return {
    id: String(api.id),
    name: api.name,
    description: api.description,
    address: api.address,
    latitude: Number(lat),
    longitude: Number(lng),
    capacity: api.capacity,
    imageUrl: api.imageUrl ?? api.images?.[0],
    createdAt: api.createdAt,
    updatedAt: api.updatedAt,
    category: api.category,
    rating: api.rating,
    reviewCount: api.reviewCount ?? api.review_count,
    priceRange: api.priceRange ?? api.price_range,
  };
}

function isConnectionError(err: unknown): boolean {
  const e = err as { code?: string; message?: string; response?: unknown };
  if (e?.response) return false;
  return !!(
    e?.code === 'ERR_NETWORK' ||
    e?.code === 'ECONNREFUSED' ||
    e?.code === 'ERR_CONNECTION_REFUSED' ||
    e?.message?.includes('Network Error') ||
    e?.message?.includes('Connection refused')
  );
}

function mockGetAll(bounds?: BoundingBox): Venue[] {
  if (!bounds) return MOCK_VENUES;
  return MOCK_VENUES.filter(
    (v) =>
      v.latitude >= bounds.south &&
      v.latitude <= bounds.north &&
      v.longitude >= bounds.west &&
      v.longitude <= bounds.east
  );
}

export const venuesApi = {
  /**
   * GET /api/venues — theo Postman: query min_lat, max_lat, min_lng, max_lng khi có bounds.
   * Response: { data: Venue[] } hoặc mảng trực tiếp.
   */
  getAll: async (bounds?: BoundingBox): Promise<Venue[]> => {
    if (USE_MOCK) {
      return mockGetAll(bounds);
    }
    try {
      const params: Record<string, string> = {};
      if (bounds) {
        params.min_lat = String(bounds.south);
        params.max_lat = String(bounds.north);
        params.min_lng = String(bounds.west);
        params.max_lng = String(bounds.east);
      }
      const { data } = await apiClient.get<VenuesApiResponse | VenueApi[]>(VENUES_ENDPOINT, { params });
      const list = Array.isArray(data) ? data : (data as VenuesApiResponse).data ?? [];
      return (list as VenueApi[]).map(mapApiVenueToVenue);
    } catch (err) {
      if (isConnectionError(err)) {
        return mockGetAll(bounds);
      }
      throw err;
    }
  },

  getById: async (id: string): Promise<Venue> => {
    if (USE_MOCK) {
      const v = MOCK_VENUES.find((x) => x.id === id);
      if (!v) throw new Error('Venue not found');
      return v;
    }
    const { data } = await apiClient.get<VenueApi>(`${VENUES_ENDPOINT}/${id}`);
    return mapApiVenueToVenue(data);
  },

  create: async (input: VenueCreateInput): Promise<Venue> => {
    if (USE_MOCK) {
      const newVenue: Venue = {
        ...input,
        id: `mock-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return newVenue;
    }
    const { data } = await apiClient.post<Venue>(VENUES_ENDPOINT, input);
    return data;
  },

  update: async (input: VenueUpdateInput): Promise<Venue> => {
    if (USE_MOCK) {
      const existing = MOCK_VENUES.find((x) => x.id === input.id);
      if (!existing) throw new Error('Venue not found');
      return { ...existing, ...input, updatedAt: new Date().toISOString() };
    }
    const { id, ...payload } = input;
    const { data } = await apiClient.patch<Venue>(`${VENUES_ENDPOINT}/${id}`, payload);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    if (USE_MOCK) return;
    await apiClient.delete(`${VENUES_ENDPOINT}/${id}`);
  },
};
