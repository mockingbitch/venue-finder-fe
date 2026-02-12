"use client";

import { useState } from "react";
import { toggleFavorite } from "@/lib/api";

export function FavoriteButton({
  venueId,
  isFavorited: initial,
  onToggle,
  sessionId,
}: {
  venueId: number;
  isFavorited: boolean;
  onToggle: (newFavorited: boolean) => void;
  sessionId?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [isFavorited, setIsFavorited] = useState(initial);

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return;
    setLoading(true);
    try {
      const res = await toggleFavorite(venueId, sessionId);
      setIsFavorited(res.data.is_favorited);
      onToggle(res.data.is_favorited);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="w-9 h-9 rounded-full bg-white/90 shadow flex items-center justify-center hover:bg-white transition disabled:opacity-50"
      aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
    >
      <span className={isFavorited ? "text-red-500" : "text-slate-400"}>
        {isFavorited ? "♥" : "♡"}
      </span>
    </button>
  );
}
