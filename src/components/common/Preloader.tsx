import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import { MonogramSeal } from "@/components/ornaments/ornaments";
import { useLanguage } from "@/lib/i18n";

import { EASE } from "./Reveal";

/** Layar singkat saat font & halaman sedang dimuat. */
export function Preloader() {
  const { t } = useLanguage();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const minimum = new Promise((resolve) => window.setTimeout(resolve, 950));
    const fonts = document.fonts.ready.catch(() => undefined);
    const loaded = new Promise<void>((resolve) => {
      if (document.readyState === "complete") resolve();
      else window.addEventListener("load", () => resolve(), { once: true });
    });

    Promise.all([minimum, fonts, loaded]).then(() => setReady(true));
  }, []);

  return (
    <AnimatePresence>
      {!ready && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="fixed inset-0 z-[95] grid place-items-center bg-night"
          role="status"
          aria-label={t.preloader.loading}
        >
          <div className="flex flex-col items-center gap-7">
            <div className="relative grid h-28 w-28 place-items-center">
              <span className="absolute inset-0 rounded-full border border-gold/25" />
              <span className="absolute inset-0 animate-spin-ring rounded-full border border-transparent border-t-gold" />
              <MonogramSeal className="h-20 w-20 text-cream" />
            </div>
            <p className="text-[11px] uppercase tracking-[0.4em] text-gold">
              {t.preloader.loading}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
