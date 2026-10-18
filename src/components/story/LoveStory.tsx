import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";

import { Reveal } from "@/components/common/Reveal";
import { SectionTitle } from "@/components/common/SectionTitle";
import { EucalyptusSprig } from "@/components/ornaments/ornaments";
import { useLanguage } from "@/lib/i18n";

/** Kisah kami — timeline vertikal dengan garis emas yang tergambar saat scroll. */
export function LoveStory() {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "end 0.5"],
  });
  const scaleY = useSpring(scrollYProgress, { stiffness: 60, damping: 22 });

  return (
    <section
      id="story"
      className="grain grain-dark relative overflow-hidden bg-night px-6 py-24 md:py-32 scroll-mt-16"
    >
      <EucalyptusSprig className="pointer-events-none absolute -left-12 top-12 h-72 w-36 rotate-[16deg] text-sage/30 md:h-96 md:w-48" />
      <EucalyptusSprig className="pointer-events-none absolute -right-12 bottom-12 h-72 w-36 -rotate-[16deg] -scale-x-100 text-sage/30 md:h-96 md:w-48" />

      <SectionTitle tone="dark" eyebrow={t.story.eyebrow} title={t.story.title} />

      <div ref={containerRef} className="relative z-10 mx-auto mt-16 max-w-3xl">
        {/* garis waktu */}
        <span className="absolute left-4 top-0 h-full w-px bg-gold/15 md:left-1/2" />
        <motion.span
          style={reduce ? undefined : { scaleY }}
          className="absolute left-4 top-0 h-full w-px origin-top bg-gradient-to-b from-gold via-gold to-transparent md:left-1/2"
        />

        <ol className="space-y-14">
          {t.story.chapters.map((chapter, index) => {
            const alignRight = index % 2 === 1;
            return (
              <li key={chapter.title} className="relative md:grid md:grid-cols-2 md:gap-16">
                <span
                  aria-hidden="true"
                  className="absolute left-4 top-7 h-2.5 w-2.5 -translate-x-1/2 rotate-45 border border-gold bg-night md:left-1/2"
                />
                <div
                  className={
                    alignRight
                      ? "pl-12 md:col-start-2 md:pl-16"
                      : "pl-12 md:pr-16 md:text-right"
                  }
                >
                  <Reveal delay={0.05}>
                    <p className="text-[11px] uppercase tracking-[0.4em] text-gold">
                      {chapter.year}
                    </p>
                    <h3 className="mt-2.5 font-display text-3xl text-cream">
                      {chapter.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-sage-light">
                      {chapter.text}
                    </p>
                  </Reveal>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
