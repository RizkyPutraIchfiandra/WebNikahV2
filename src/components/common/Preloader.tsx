import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import { weddingConfig } from "@/data/weddingConfig";
import { useLanguage } from "@/lib/i18n";

import { EASE } from "./Reveal";

/** Layar singkat saat font & halaman dimuat — ringkas, dua bahasa. */
export function Preloader() {
  const { t } = useLanguage();
  const { couple } = weddingConfig;
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
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(44,85,69,0.5),transparent_62%)]" />

          <div className="relative flex flex-col items-center px-8 text-center">
            <p className="font-display text-3xl text-cream md:text-4xl">
              {couple.groomName}
              <span className="text-gold-foil mx-2 inline-block italic">&amp;</span>
              {couple.brideName}
            </p>

            <div className="mt-7 h-px w-44 overflow-hidden bg-gold/20">
              <span className="loader-sweep block h-full w-1/2 bg-gold" />
            </div>

            <p className="mt-6 text-[9.5px] uppercase tracking-[0.34em] text-sage-light">
              Menyiapkan undangan
              <span className="mx-2 text-gold/70">·</span>
              Preparing your invitation
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
