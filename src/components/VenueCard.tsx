"use client";

import Image from "next/image";
import { useState } from "react";
import type { Venue } from "@/lib/api";
import { getPriceLevelStars } from "@/lib/api";
import { FavoriteButton } from "./FavoriteButton";
import { RequestQuoteModal } from "./RequestQuoteModal";

const placeholderImage = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80";

export function VenueCard({
  venue,
  sessionId,
  isFavorited,
  onFavoriteToggle,
}: {
  venue: Venue;
  sessionId?: string;
  isFavorited: boolean;
  onFavoriteToggle: (venueId: number, isFavorited: boolean) => void;
}) {
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const imgSrc = venue.image_url || placeholderImage;

  return (
    <>
      <article className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        <div className="relative aspect-[4/3] bg-slate-100">
          <Image
            src={imgSrc}
            alt={venue.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
            unoptimized={imgSrc.startsWith("http") && !imgSrc.includes("unsplash")}
          />
          {venue.video_thumbnail_url && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                <span className="text-2xl ml-1">▶</span>
              </div>
            </div>
          )}
          {venue.has_offer && (
            <span className="absolute bottom-2 left-2 bg-primary text-white text-xs font-semibold px-2 py-1 rounded">
              OFFER
            </span>
          )}
          <div className="absolute top-2 right-2">
            <FavoriteButton
              venueId={venue.id}
              isFavorited={isFavorited}
              onToggle={(newFavorited) => onFavoriteToggle(venue.id, newFavorited)}
              sessionId={sessionId}
            />
          </div>
        </div>
        <div className="p-4 flex flex-col flex-1">
          <h2 className="font-semibold text-slate-800 line-clamp-2">{venue.name}</h2>
          <p className="text-sm text-slate-500 mt-0.5">{venue.category}</p>
          <p className="text-sm text-slate-600">{venue.suburb}</p>
          <button
            onClick={() => setShowQuoteModal(true)}
            className="mt-3 w-full py-2.5 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition"
          >
            Request Quote
          </button>
          <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-600">
            <span title="Capacity">{venue.capacity} guests</span>
            {venue.area_sqm != null && <span>{venue.area_sqm} m²</span>}
            <span className="flex items-center gap-0.5">
              ★ {Number(venue.rating).toFixed(1)} ({venue.reviews_count})
            </span>
            <span>{getPriceLevelStars(venue.price_level)}</span>
          </div>
        </div>
      </article>
      {showQuoteModal && (
        <RequestQuoteModal
          venue={venue}
          onClose={() => setShowQuoteModal(false)}
          onSuccess={() => setShowQuoteModal(false)}
        />
      )}
    </>
  );
}
