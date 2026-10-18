import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { EASE, Reveal } from "@/components/common/Reveal";
import { SectionTitle } from "@/components/common/SectionTitle";
import { weddingConfig } from "@/data/weddingConfig";
import { useBodyLock } from "@/hooks";
import { useLanguage } from "@/lib/i18n";

/** Galeri masonry di atas emerald gelap + lightbox yang bisa digeser (swipe). */
export function Gallery() {
  const { t } = useLanguage();
  const images = weddingConfig.media.galleryImages;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);
  const step = useCallback(
    (direction: 1 | -1) => {
      setOpenIndex((current) =>
        current === null ? current : (current + direction + images.length) % images.length,
      );
    },
    [images.length],
  );

  useBodyLock(openIndex !== null);

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIndex, close, step]);

  return (
    <section
      id="gallery"
      className="grain grain-dark relative scroll-mt-16 bg-night px-6 py-24 md:py-32"
    >
      <SectionTitle
        tone="dark"
        index="05"
        eyebrow={t.gallery.eyebrow}
        title={t.gallery.title}
        subtitle={t.gallery.subtitle}
      />

      <div className="relative z-10 mx-auto mt-14 max-w-5xl columns-2 gap-4 md:columns-3 md:gap-5">
        {images.map((image, index) => (
          <Reveal
            key={image.src}
            delay={(index % 3) * 0.08}
            className="mb-4 break-inside-avoid md:mb-5"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(index)}
              aria-label={`${t.gallery.enlarge} — ${image.alt}`}
              className="group block w-full cursor-pointer overflow-hidden rounded-xl border border-gold/20 bg-night-deep transition-colors duration-300 hover:border-gold/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                decoding="async"
                className="w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />
            </button>
          </Reveal>
        ))}
      </div>

      <AnimatePresence>
        {openIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="fixed inset-0 z-[70] flex flex-col bg-night/95 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label={t.gallery.preview}
          >
            <div className="flex items-center justify-between px-5 py-4">
              <p className="text-[11px] uppercase tracking-[0.3em] text-gold">
                {openIndex + 1} / {images.length}
              </p>
              <button
                type="button"
                onClick={close}
                aria-label={t.gallery.close}
                className="grid h-10 w-10 cursor-pointer place-items-center rounded-full border border-gold/40 text-cream transition-colors hover:bg-gold hover:text-night focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="relative flex flex-1 items-center justify-center px-4 pb-20">
              <motion.img
                key={images[openIndex].src}
                src={images[openIndex].src}
                alt={images[openIndex].alt}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.45, ease: EASE }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.12}
                onDragEnd={(_event, info) => {
                  if (info.offset.x < -70) step(1);
                  else if (info.offset.x > 70) step(-1);
                }}
                className="max-h-[76vh] max-w-full cursor-grab rounded-lg border border-gold/25 object-contain shadow-2xl active:cursor-grabbing"
              />

              <button
                type="button"
                onClick={() => step(-1)}
                aria-label={t.gallery.previous}
                className="glass-dark absolute left-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 cursor-pointer place-items-center rounded-full text-cream transition-colors hover:text-gold md:grid"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label={t.gallery.next}
                className="glass-dark absolute right-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 cursor-pointer place-items-center rounded-full text-cream transition-colors hover:text-gold md:grid"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
