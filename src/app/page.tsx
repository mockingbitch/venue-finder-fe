"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { VenueList } from "@/components/VenueList";
import { VenueMap } from "@/components/VenueMap";
import { fetchFavorites, type MapVenue } from "@/lib/api";

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = sessionStorage.getItem("venuefinder_session_id");
  if (!id) {
    id = "s_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
    sessionStorage.setItem("venuefinder_session_id", id);
  }
  return id;
}

export default function Home() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [suburb, setSuburb] = useState("");
  const [page, setPage] = useState(1);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [mapVenues, setMapVenues] = useState<MapVenue[]>([]);
  const [sessionId] = useState(() => getSessionId());

  useEffect(() => {
    fetchFavorites(sessionId).then((res) => setFavoriteIds(res.data));
  }, [sessionId]);

  const filters = useMemo(
    () => ({ search: search || undefined, category: category || undefined, suburb: suburb || undefined, page }),
    [search, category, suburb, page]
  );
  const mapFilters = useMemo(() => ({ category: category || undefined, suburb: suburb || undefined }), [category, suburb]);

  const onMapVenuesChange = useCallback((venues: MapVenue[]) => setMapVenues(venues), []);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-slate-200 bg-white px-4 py-3">
        <h1 className="text-xl font-semibold text-slate-800">VenueFinder – Venues & Spaces</h1>
        <div className="mt-3 flex flex-wrap gap-2">
          <input
            type="search"
            placeholder="Tìm venue..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="px-3 py-2 border border-slate-200 rounded-lg w-48 focus:ring-2 focus:ring-slate-400 focus:border-transparent"
          />
          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
            className="px-3 py-2 border border-slate-200 rounded-lg w-40 focus:ring-2 focus:ring-slate-400 focus:border-transparent"
          />
          <input
            type="text"
            placeholder="Suburb"
            value={suburb}
            onChange={(e) => { setSuburb(e.target.value); setPage(1); }}
            className="px-3 py-2 border border-slate-200 rounded-lg w-40 focus:ring-2 focus:ring-slate-400 focus:border-transparent"
          />
        </div>
      </header>

      <div className="flex-1 flex min-h-0">
        <main className="flex-1 overflow-y-auto px-4 py-6 lg:max-w-[66%]">
          <VenueList
            filters={filters}
            favoriteIds={favoriteIds}
            sessionId={sessionId}
            onFavoriteIdsChange={setFavoriteIds}
          />
        </main>
        <aside className="hidden lg:block w-[34%] min-w-[320px] min-h-[400px] sticky top-0 self-start">
          <VenueMap
            mapVenues={mapVenues}
            onMapVenuesChange={onMapVenuesChange}
            filters={mapFilters}
          />
        </aside>
      </div>
    </div>
  );
}
