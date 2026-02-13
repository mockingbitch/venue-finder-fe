import { apiClient } from '@/lib/axios';
import { MOCK_VENUES } from '@/data/mockVenues';
import type { Venue, VenueCreateInput, VenueUpdateInput } from '@/types/venue';
import type { BoundingBox } from '@/types/venue';

const VENUES_ENDPOINT = '/venues';
// Default to mock when not explicitly disabled (for dev without backend)
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA !== 'false';

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
   * Fetch venues, optionally filtered by bounding box.
   * Uses mock data when NEXT_PUBLIC_USE_MOCK_DATA=true or when API is unreachable.
   */
  getAll: async (bounds?: BoundingBox): Promise<Venue[]> => {
    if (USE_MOCK) {
      return mockGetAll(bounds);
    }
    try {
      const params = bounds
        ? {
            north: bounds.north,
            south: bounds.south,
            east: bounds.east,
            west: bounds.west,
          }
        : {};
      const { data } = await apiClient.get<Venue[]>(VENUES_ENDPOINT, { params });
      return data;
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
    const { data } = await apiClient.get<Venue>(`${VENUES_ENDPOINT}/${id}`);
    return data;
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
