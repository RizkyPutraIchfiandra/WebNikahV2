import * as L from "leaflet";
import { useEffect, useRef } from "react";

import { weddingConfig } from "@/data/weddingConfig";
import { useLanguage } from "@/lib/i18n";

/* Pin botani emas — digambar langsung sebagai SVG inline. */
const PIN_HTML = `
<svg class="map-pin" width="44" height="56" viewBox="0 0 44 56" xmlns="http://www.w3.org/2000/svg">
  <path d="M22 2 C 34 2, 42 11, 42 22 C 42 34, 30 44, 22 54 C 14 44, 2 34, 2 22 C 2 11, 10 2, 22 2 Z" fill="#2c5545" stroke="#d4af37" stroke-width="1.6"/>
  <circle cx="22" cy="21" r="8" fill="#0d291e" stroke="#d4af37" stroke-width="1"/>
  <path d="M22 15 C 24.5 17.5, 24.5 22, 22 24.5 C 19.5 22, 19.5 17.5, 22 15 Z" fill="#d4af37"/>
</svg>`;

/** Canvas Leaflet dengan ubin OpenStreetMap standar (bebas API key) + pin kustom. */
export default function VenueMapCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  const { event } = weddingConfig;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const map = L.map(container, {
      center: [event.latitude, event.longitude],
      zoom: 15,
      scrollWheelZoom: false,
    });

    // Ubin OpenStreetMap standar — bebas API key, langsung muncul.
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

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
        `<strong>${t.event.venue}</strong><br/><span style="font-size:12px">${t.event.address}</span>`,
      )
      .openPopup();

    return () => {
      map.remove();
    };
  }, [event.latitude, event.longitude, t.event.venue, t.event.address]);

  return <div ref={containerRef} className="h-full w-full" />;
}
