import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { EASE, Reveal } from "@/components/common/Reveal";
import { SectionTitle } from "@/components/common/SectionTitle";
import { weddingConfig } from "@/data/weddingConfig";
import { useBodyLock } from "@/hooks";
import { useLanguage } from "@/lib/i18n";

/** Offset melingkar relatif terhadap slide aktif (carousel tak berujung). */
function wrapOffset(index: number, active: number, count: number) {
  const half = Math.floor(count / 2);
  let offset = index - active;
  if (offset > half) offset -= count;
  else if (offset < -half) offset += count;
  return offset;
}

/** Satu slide carousel — posisi, skala, dan opasitas mengikuti jarak dari slide aktif. */
function CarouselSlide({
  image,
  offset,
  active,
  enlargeLabel,
  onSelect,
}: {
  image: { src: string; alt: string };
  offset: number;
  active: boolean;
  enlargeLabel: string;
  onSelect: () => void;
}) {
  const distance = Math.abs(offset);
  const slid = Math.max(-2, Math.min(2, offset));
  const hidden = distance >= 2;

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      aria-label={active ? `${enlargeLabel} — ${image.alt}` : image.alt}
      aria-hidden={hidden}
      tabIndex={hidden ? -1 : 0}
      animate={{
        x: `${slid * 76}%`,
        scale: slid === 0 ? 1 : distance === 1 ? 0.84 : 0.78,
        opacity: slid === 0 ? 1 : distance === 1 ? 0.45 : 0,
      }}
      transition={{ type: "spring", stiffness: 240, damping: 28 }}
      style={{ zIndex: 10 - distance }}
      className={`absolute inset-0 cursor-pointer select-none overflow-hidden rounded-2xl border bg-night-deep shadow-2xl transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${
        active ? "border-gold/60" : "border-gold/20 hover:border-gold/45"
      } ${hidden ? "pointer-events-none" : ""}`}
    >
      <img
        src={image.src}
        alt={image.alt}
        loading="lazy"
        decoding="async"
        draggable={false}
        className="h-full w-full object-cover"
      />
      {active && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-3 rounded-xl border border-gold/25"
        />
      )}
    </motion.button>
  );
}

/** Galeri carousel di atas emerald gelap + lightbox (klik foto untuk memperbesar). */
export function Gallery() {
  const { t } = useLanguage();
  const images = weddingConfig.media.galleryImages;
  const [activeIndex, setActiveIndex] = useState(0);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const draggedRef = useRef(false);

  const stepCarousel = useCallback(
    (direction: 1 | -1) =>
      setActiveIndex((current) => (current + direction + images.length) % images.length),
    [images.length],
  );

  const closeLightbox = useCallback(() => setOpenIndex(null), []);

  /* Lightbox juga menyinkronkan posisi carousel. */
  const stepLightbox = useCallback(
    (direction: 1 | -1) => {
      setOpenIndex((current) =>
        current === null ? current : (current + direction + images.length) % images.length,
      );
      setActiveIndex((current) => (current + direction + images.length) % images.length);
    },
    [images.length],
  );

  useBodyLock(openIndex !== null);

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowRight") stepLightbox(1);
      if (event.key === "ArrowLeft") stepLightbox(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIndex, closeLightbox, stepLightbox]);

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

      <Reveal className="relative z-10 mt-14 md:mt-16">
        {/* panggung carousel — geser (swipe/drag) untuk berpindah foto */}
        <div
          role="group"
          aria-label={t.gallery.title}
          className="relative overflow-hidden py-2"
        >
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.12}
            onDragEnd={(_event, info) => {
              if (Math.abs(info.offset.x) > 8) {
                draggedRef.current = true;
                window.setTimeout(() => {
                  draggedRef.current = false;
                }, 120);
              }
              if (info.offset.x < -60) stepCarousel(1);
              else if (info.offset.x > 60) stepCarousel(-1);
            }}
            className="relative mx-auto h-[360px] w-full max-w-[280px] cursor-grab active:cursor-grabbing sm:h-[420px] sm:max-w-[320px] md:h-[500px] md:max-w-[380px]"
          >
            {images.map((image, index) => (
              <CarouselSlide
                key={image.src}
                image={image}
                offset={wrapOffset(index, activeIndex, images.length)}
                active={index === activeIndex}
                enlargeLabel={t.gallery.enlarge}
                onSelect={() => {
                  if (draggedRef.current) return;
                  if (index === activeIndex) setOpenIndex(index);
                  else setActiveIndex(index);
                }}
              />
            ))}
          </motion.div>
        </div>

        {/* kontrol: panah + titik navigasi */}
        <div className="relative z-10 mt-8 flex items-center justify-center gap-6">
          <button
            type="button"
            onClick={() => stepCarousel(-1)}
            aria-label={t.gallery.previous}
            className="glass-dark grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-gold/30 text-cream transition-colors hover:border-gold hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2">
            {images.map((image, index) => (
              <button
                key={image.src}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`${t.gallery.goTo} ${index + 1}`}
                aria-current={index === activeIndex}
                className={`h-1.5 cursor-pointer rounded-full transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${
                  index === activeIndex ? "w-6 bg-gold" : "w-1.5 bg-cream/25 hover:bg-gold/50"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => stepCarousel(1)}
            aria-label={t.gallery.next}
            className="glass-dark grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-gold/30 text-cream transition-colors hover:border-gold hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </Reveal>

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
                onClick={closeLightbox}
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
                  if (info.offset.x < -70) stepLightbox(1);
                  else if (info.offset.x > 70) stepLightbox(-1);
                }}
                className="max-h-[76vh] max-w-full cursor-grab rounded-lg border border-gold/25 object-contain shadow-2xl active:cursor-grabbing"
              />

              <button
                type="button"
                onClick={() => stepLightbox(-1)}
                aria-label={t.gallery.previous}
                className="glass-dark absolute left-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 cursor-pointer place-items-center rounded-full text-cream transition-colors hover:text-gold md:grid"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => stepLightbox(1)}
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
