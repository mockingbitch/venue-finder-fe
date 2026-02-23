import { apiClient } from '@/lib/axios';
import { MOCK_VENUES } from '@/data/mockVenues';
import type { Venue, VenueCreateInput, VenueUpdateInput } from '@/types/venue';
import type { BoundingBox } from '@/types/venue';

const VENUES_ENDPOINT = '/venues';
const ADMIN_VENUES_ENDPOINT = '/admin/venues';
// Default to mock when not explicitly disabled (for dev without backend)
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA !== 'false';

/** API trả về { data: [...] } (Postman Get venues) */
interface VenuesApiResponse {
  data: VenueApi[];
}

/** Laravel paginate: { data: [...], meta: { current_page, last_page, total, per_page } } */
export interface VenuesPaginatedResponse {
  data: VenueApi[];
  meta: {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
  };
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
  price?: number;
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
    price: api.price,
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

/** Chuyển payload form sang đúng tên trường API Laravel (lat, lng, images, ...) */
function toApiVenuePayload(input: Partial<VenueCreateInput> & { name: string; latitude: number; longitude: number; price: number }): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    name: input.name,
    lat: input.latitude,
    lng: input.longitude,
    price: input.price,
    description: input.description ?? null,
    address: input.address ?? null,
    capacity: input.capacity ?? 0,
  };
  if (input.imageUrl) {
    payload.images = [input.imageUrl];
  }
  return payload;
}

export const venuesApi = {
  /**
   * GET /api/venues — theo Postman: query min_lat, max_lat, min_lng, max_lng khi có bounds.
   * per_page=0 dùng cho map để lấy toàn bộ venue.
   * Response: { data: Venue[] } hoặc mảng trực tiếp.
   */
  getAll: async (bounds?: BoundingBox, options?: { per_page?: number }): Promise<Venue[]> => {
    if (USE_MOCK) {
      return mockGetAll(bounds);
    }
    try {
      const params: Record<string, string | number> = {};
      if (bounds) {
        params.min_lat = String(bounds.south);
        params.max_lat = String(bounds.north);
        params.min_lng = String(bounds.west);
        params.max_lng = String(bounds.east);
      }
      if (options?.per_page !== undefined) {
        params.per_page = options.per_page;
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

  /**
   * GET /api/venues?page=1&per_page=10 — danh sách có phân trang (Laravel).
   */
  getPaginated: async (
    page: number = 1,
    perPage: number = 10
  ): Promise<{ venues: Venue[]; total: number; lastPage: number }> => {
    if (USE_MOCK) {
      const start = (page - 1) * perPage;
      const list = MOCK_VENUES.slice(start, start + perPage).map((v) => ({
        ...v,
        latitude: v.latitude,
        longitude: v.longitude,
      }));
      return {
        venues: list,
        total: MOCK_VENUES.length,
        lastPage: Math.max(1, Math.ceil(MOCK_VENUES.length / perPage)),
      };
    }
    const { data } = await apiClient.get<VenuesPaginatedResponse>(
      VENUES_ENDPOINT,
      { params: { page, per_page: perPage } }
    );
    const list = (data.data ?? []).map((api) => mapApiVenueToVenue(api));
    const meta = data.meta ?? {
      current_page: page,
      last_page: 1,
      total: list.length,
      per_page: perPage,
    };
    return {
      venues: list,
      total: meta.total,
      lastPage: meta.last_page,
    };
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
    const payload = toApiVenuePayload(input);
    const { data } = await apiClient.post<Venue>(ADMIN_VENUES_ENDPOINT, payload);
    return data;
  },

  update: async (input: VenueUpdateInput): Promise<Venue> => {
    if (USE_MOCK) {
      const existing = MOCK_VENUES.find((x) => x.id === input.id);
      if (!existing) throw new Error('Venue not found');
      return { ...existing, ...input, updatedAt: new Date().toISOString() };
    }
    const { id, ...rest } = input;
    const payload = toApiVenuePayload(rest as VenueCreateInput);
    const { data } = await apiClient.put<Venue>(`${ADMIN_VENUES_ENDPOINT}/${id}`, payload);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    if (USE_MOCK) return;
    await apiClient.delete(`${ADMIN_VENUES_ENDPOINT}/${id}`);
  },
};
