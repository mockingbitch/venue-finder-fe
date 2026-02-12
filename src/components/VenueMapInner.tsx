"use client";

import { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import type { MapVenue } from "@/lib/api";

import "react-leaflet-cluster/dist/assets/MarkerCluster.css";
import "react-leaflet-cluster/dist/assets/MarkerCluster.Default.css";

const defaultCenter: [number, number] = [-33.8688, 151.2093];
const defaultZoom = 14;

function createMarkerIcon() {
  return L.divIcon({
    html: '<div class="venue-marker"></div>',
    className: "venue-marker-icon",
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}

function createClusterIcon(cluster: { getChildCount: () => number }) {
  const count = cluster.getChildCount();
  return L.divIcon({
    html: `<span class="venue-cluster">${count}</span>`,
    className: "venue-cluster-icon",
    iconSize: L.point(40, 40, true),
    iconAnchor: [20, 20],
  });
}

function MapContent({ venues }: { venues: MapVenue[] }) {
  const markers = useMemo(
    () =>
      venues.map((v) => (
        <Marker
          key={v.id}
          position={[Number(v.lat), Number(v.lng)]}
          icon={createMarkerIcon()}
        >
          <Popup>
            <div className="text-sm font-medium">{v.name}</div>
            <div className="text-xs text-slate-500">
              {v.suburb} · {v.category}
            </div>
          </Popup>
        </Marker>
      )),
    [venues]
  );

  return (
    <>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MarkerClusterGroup
        chunkedLoading
        maxClusterRadius={80}
        spiderfyOnMaxZoom
        showCoverageOnHover={false}
        zoomToBoundsOnClick
        iconCreateFunction={createClusterIcon}
      >
        {markers}
      </MarkerClusterGroup>
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
