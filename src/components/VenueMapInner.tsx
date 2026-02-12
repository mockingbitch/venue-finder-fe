"use client";

import { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import type { MapVenue } from "@/lib/api";

const defaultCenter: [number, number] = [-33.8688, 151.2093];
const defaultZoom = 14;
const clusterDistance = 0.012;

function createClusterIcon(count: number) {
  return L.divIcon({
    html: `<div class="cluster-marker">${count}</div>`,
    className: "cluster-div-icon",
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
}

function createMarkerIcon() {
  return L.divIcon({
    html: '<div class="w-4 h-4 rounded-full bg-[#dc2626] border-2 border-white shadow"></div>',
    className: "single-marker-icon",
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}

function useClusteredMarkers(venues: MapVenue[]) {
  return useMemo(() => {
    if (!venues.length) return { clusters: [], singles: [] };
    const clusters: { position: [number, number]; count: number; venues: MapVenue[] }[] = [];
    const used = new Set<number>();

    for (const v of venues) {
      if (used.has(v.id)) continue;
      const lat = Number(v.lat);
      const lng = Number(v.lng);
      const nearby = venues.filter(
        (u) =>
          !used.has(u.id) &&
          Math.abs(Number(u.lat) - lat) < clusterDistance &&
          Math.abs(Number(u.lng) - lng) < clusterDistance
      );
      if (nearby.length >= 2) {
        const avgLat = nearby.reduce((s, u) => s + Number(u.lat), 0) / nearby.length;
        const avgLng = nearby.reduce((s, u) => s + Number(u.lng), 0) / nearby.length;
        clusters.push({ position: [avgLat, avgLng], count: nearby.length, venues: nearby });
        nearby.forEach((u) => used.add(u.id));
      } else if (nearby.length === 1) {
        used.add(v.id);
      }
    }
    const inCluster = new Set(clusters.flatMap((c) => c.venues.map((v) => v.id)));
    const singles = venues.filter((v) => !inCluster.has(v.id));
    return { clusters, singles };
  }, [venues]);
}

function MapContent({ venues }: { venues: MapVenue[] }) {
  const { clusters, singles } = useClusteredMarkers(venues);

  return (
    <>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {clusters.map((c, i) => (
        <Marker key={`c-${i}`} position={c.position} icon={createClusterIcon(c.count)}>
          <Popup>
            <div className="text-sm">
              {c.venues.slice(0, 5).map((v) => (
                <div key={v.id}>{v.name}</div>
              ))}
              {c.count > 5 && <div>+{c.count - 5} more</div>}
            </div>
          </Popup>
        </Marker>
      ))}
      {singles.map((v) => (
        <Marker
          key={v.id}
          position={[Number(v.lat), Number(v.lng)]}
          icon={createMarkerIcon()}
        >
          <Popup>
            <div className="text-sm font-medium">{v.name}</div>
            <div className="text-xs text-slate-500">{v.suburb} · {v.category}</div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}

export default function VenueMapInner({ venues }: { venues: MapVenue[] }) {
  return (
    <MapContainer
      center={defaultCenter}
      zoom={defaultZoom}
      className="h-full w-full rounded-br-lg"
      scrollWheelZoom
    >
      <MapContent venues={venues} />
    </MapContainer>
  );
}
