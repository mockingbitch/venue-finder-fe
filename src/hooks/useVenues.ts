'use client';

import { useQuery } from '@tanstack/react-query';
import { venuesApi } from '@/services/api';
import type { BoundingBox } from '@/types/venue';

export const VENUES_QUERY_KEY = 'venues';

export function useVenues(bounds?: BoundingBox | null) {
  return useQuery({
    queryKey: [VENUES_QUERY_KEY, bounds ?? 'all'],
    queryFn: () =>
      venuesApi.getAll(bounds ?? undefined, { per_page: 0 }),
    placeholderData: (previousData) => previousData,
  });
}
