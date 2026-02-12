const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export type Venue = {
  id: number;
  name: string;
  slug: string;
  category: string;
  suburb: string;
  lat: string | null;
  lng: string | null;
  capacity: number;
  area_sqm: number | null;
  rating: string;
  reviews_count: number;
  price_level: number;
  description: string | null;
  image_url: string | null;
  video_thumbnail_url: string | null;
  has_offer: boolean;
  spaces_count?: number;
};

export type VenuesResponse = {
  data: Venue[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    venues_count: number;
    spaces_count: number;
  };
};

export type MapVenue = Pick<Venue, "id" | "name" | "slug" | "lat" | "lng" | "category" | "suburb" | "rating" | "price_level">;

export type MapResponse = {
  data: MapVenue[];
  meta: { venues_count: number; spaces_count: number };
};

export async function fetchVenues(params: {
  page?: number;
  search?: string;
  category?: string;
  suburb?: string;
  min_capacity?: number;
  max_price_level?: number;
  per_page?: number;
}): Promise<VenuesResponse> {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", String(params.page));
  if (params.search) searchParams.set("search", params.search);
  if (params.category) searchParams.set("category", params.category);
  if (params.suburb) searchParams.set("suburb", params.suburb);
  if (params.min_capacity != null) searchParams.set("min_capacity", String(params.min_capacity));
  if (params.max_price_level != null) searchParams.set("max_price_level", String(params.max_price_level));
  if (params.per_page) searchParams.set("per_page", String(params.per_page));
  const res = await fetch(`${API_BASE}/venues?${searchParams}`);
  if (!res.ok) throw new Error("Failed to fetch venues");
  return res.json();
}

export async function fetchMapVenues(params?: { category?: string; suburb?: string; bounds?: string }): Promise<MapResponse> {
  const searchParams = new URLSearchParams();
  if (params?.category) searchParams.set("category", params.category);
  if (params?.suburb) searchParams.set("suburb", params.suburb);
  if (params?.bounds) searchParams.set("bounds", params.bounds);
  const res = await fetch(`${API_BASE}/venues/map?${searchParams}`);
  if (!res.ok) throw new Error("Failed to fetch map venues");
  return res.json();
}

export async function fetchFavorites(sessionId?: string): Promise<{ data: number[] }> {
  const headers: HeadersInit = {};
  if (sessionId) headers["X-Session-Id"] = sessionId;
  const res = await fetch(`${API_BASE}/favorites`, { headers });
  if (!res.ok) return { data: [] };
  return res.json();
}

export async function toggleFavorite(venueId: number, sessionId?: string): Promise<{ data: { is_favorited: boolean } }> {
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (sessionId) headers["X-Session-Id"] = sessionId;
  const res = await fetch(`${API_BASE}/favorites/${venueId}/toggle`, { method: "POST", headers });
  if (!res.ok) throw new Error("Failed to toggle favorite");
  return res.json();
}

export async function submitQuoteRequest(body: {
  venue_id: number;
  name: string;
  email: string;
  phone?: string;
  event_date?: string;
  guests?: number;
  message?: string;
}): Promise<{ data: unknown; message: string }> {
  const res = await fetch(`${API_BASE}/quote-requests`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.errors ? JSON.stringify(data.errors) : "Failed to submit quote");
  return data;
}

export function getPriceLevelStars(level: number): string {
  return "$".repeat(level);
}
