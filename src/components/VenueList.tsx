"use client";

import { useEffect, useState } from "react";
import { fetchVenues, type Venue, type VenuesResponse } from "@/lib/api";
import { VenueCard } from "./VenueCard";

type Filters = {
  search?: string;
  category?: string;
  suburb?: string;
  page: number;
};

export function VenueList({
  filters,
  favoriteIds,
  sessionId,
  onFavoriteIdsChange,
}: {
  filters: Filters;
  favoriteIds: number[];
  sessionId?: string;
  onFavoriteIdsChange: (ids: number[]) => void;
}) {
  const [data, setData] = useState<VenuesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchVenues({
      page: filters.page,
      search: filters.search,
      category: filters.category,
      suburb: filters.suburb,
      per_page: 12,
    })
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : "Lỗi tải dữ liệu"))
      .finally(() => setLoading(false));
  }, [filters.page, filters.search, filters.category, filters.suburb]);

  function handleFavoriteToggle(venueId: number, isFavorited: boolean) {
    if (isFavorited) {
      onFavoriteIdsChange([...favoriteIds, venueId]);
    } else {
      onFavoriteIdsChange(favoriteIds.filter((id) => id !== venueId));
    }
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600">
        {error}
      </div>
    );
  }

  if (loading && !data) {
    return (
      <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden animate-pulse">
            <div className="aspect-[4/3] bg-slate-200" />
            <div className="p-4 space-y-2">
              <div className="h-5 bg-slate-200 rounded w-3/4" />
              <div className="h-4 bg-slate-100 rounded w-1/2" />
              <div className="h-4 bg-slate-100 rounded w-1/3" />
              <div className="h-10 bg-slate-200 rounded mt-3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const venues = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {meta && (
        <p className="text-sm text-slate-600 mb-4 px-1">
          {meta.total} kết quả
        </p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
        {venues.map((venue) => (
          <VenueCard
            key={venue.id}
            venue={venue}
            sessionId={sessionId}
            isFavorited={favoriteIds.includes(venue.id)}
            onFavoriteToggle={handleFavoriteToggle}
          />
        ))}
      </div>
      {loading && venues.length > 0 && (
        <div className="flex justify-center py-4">
          <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
        </div>
      )}
      {!loading && venues.length === 0 && (
        <div className="py-12 text-center text-slate-500">
          Không tìm thấy venue nào.
        </div>
      )}
    </div>
  );
}
