import { MapPin } from "lucide-react";
import { Suspense, lazy, useEffect, useRef, useState } from "react";

import { useLanguage } from "@/lib/i18n";

const VenueMapCanvas = lazy(() => import("./VenueMapCanvas"));

/**
 * Bingkai peta. Canvas Leaflet (beserta pustakanya) baru dimuat saat peta
 * mendekati layar — menjaga muatan awal undangan tetap ringan.
 */
export function VenueMap() {
  const frameRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "240px 0px" },
    );

    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="overflow-hidden rounded-2xl border border-gold/40 bg-cream p-2 shadow-[0_18px_50px_rgba(13,41,30,0.08)]">
      <div
        ref={frameRef}
        role="region"
        aria-label={t.event.mapTitle}
        className="relative h-[320px] w-full overflow-hidden rounded-xl md:h-[380px]"
      >
        {visible ? (
          <Suspense fallback={<MapPlaceholder />}>
            <VenueMapCanvas />
          </Suspense>
        ) : (
          <MapPlaceholder />
        )}
      </div>
    </div>
  );
}

function MapPlaceholder() {
  return (
    <div className="grid h-full w-full place-items-center bg-[#eef0ea]">
      <MapPin className="h-8 w-8 animate-pulse-soft text-sage" />
    </div>
  );
}
