"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { fetchMapVenues, type MapVenue, type MapResponse } from "@/lib/api";

const MapInner = dynamic(() => import("./VenueMapInner"), { ssr: false });

export function VenueMap({
  mapVenues,
  onMapVenuesChange,
  filters,
}: {
  mapVenues: MapVenue[];
  onMapVenuesChange: (venues: MapVenue[]) => void;
  filters: { category?: string; suburb?: string };
}) {
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState({ venues_count: 0, spaces_count: 0 });

  const loadMap = useCallback(() => {
    setLoading(true);
    fetchMapVenues({ category: filters.category, suburb: filters.suburb })
      .then((res: MapResponse) => {
        onMapVenuesChange(res.data);
        setMeta(res.meta);
      })
      .finally(() => setLoading(false));
  }, [filters.category, filters.suburb, onMapVenuesChange]);

  useEffect(() => {
    loadMap();
  }, [loadMap]);

  return (
    <div className="h-full flex flex-col bg-white border-l border-slate-200">
      <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-700">
          {loading ? "..." : `${meta.venues_count} Venues | ${meta.spaces_count} Spaces`}
        </span>
      </div>
      <div className="flex-1 min-h-[300px] relative">
        <MapInner venues={mapVenues} />
      </div>
    </div>
  );
}
