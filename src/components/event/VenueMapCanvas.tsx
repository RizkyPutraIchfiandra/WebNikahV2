import * as L from "leaflet";
import { useEffect, useRef } from "react";

import { weddingConfig } from "@/data/weddingConfig";

/* Pin botani emas — digambar langsung sebagai SVG inline. */
const PIN_HTML = `
<svg class="map-pin" width="44" height="56" viewBox="0 0 44 56" xmlns="http://www.w3.org/2000/svg">
  <path d="M22 2 C 34 2, 42 11, 42 22 C 42 34, 30 44, 22 54 C 14 44, 2 34, 2 22 C 2 11, 10 2, 22 2 Z" fill="#2c5545" stroke="#d4af37" stroke-width="1.6"/>
  <circle cx="22" cy="21" r="8" fill="#0d291e" stroke="#d4af37" stroke-width="1"/>
  <path d="M22 15 C 24.5 17.5, 24.5 22, 22 24.5 C 19.5 22, 19.5 17.5, 22 15 Z" fill="#d4af37"/>
</svg>`;

/** Canvas Leaflet dengan ubin Esri Light Gray yang lembut (tanpa API key) + pin kustom. */
export default function VenueMapCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { event } = weddingConfig;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const map = L.map(container, {
      center: [event.latitude, event.longitude],
      zoom: 15,
      scrollWheelZoom: false,
    });

    const attribution =
      'Tiles &copy; <a href="https://www.esri.com/">Esri</a> — Esri, HERE, Garmin, &copy; OpenStreetMap contributors';

    // Ubin dasar (jalan & area) — Esri Light Gray, bebas API key.
    L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
      { attribution, maxZoom: 16 },
    ).addTo(map);

    // Lapisan nama tempat (label) di atas ubin dasar.
    L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}",
      { maxZoom: 16 },
    ).addTo(map);

    const icon = L.divIcon({
      className: "",
      html: PIN_HTML,
      iconSize: [44, 56],
      iconAnchor: [22, 54],
      popupAnchor: [0, -46],
    });

    L.marker([event.latitude, event.longitude], { icon })
      .addTo(map)
      .bindPopup(
        `<strong>${event.venueName}</strong><br/><span style="font-size:12px">${event.venueAddress}</span>`,
      )
      .openPopup();

    return () => {
      map.remove();
    };
  }, [event.latitude, event.longitude, event.venueName, event.venueAddress]);

  return <div ref={containerRef} className="h-full w-full" />;
}
