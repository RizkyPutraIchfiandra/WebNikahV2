import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useRef } from "react";

import { EASE } from "@/components/common/Reveal";
import { EucalyptusSprig } from "@/components/ornaments/ornaments";
import { weddingConfig } from "@/data/weddingConfig";
import { useLanguage } from "@/lib/i18n";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.2 } },
};

const item = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 1.1, ease: EASE } },
};

const photo = {
  hidden: { opacity: 0, y: 34, scale: 0.985 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 1.35, ease: EASE } },
};

/** Hero editorial: nama besar di kiri, potret dalam bingkai lengkung di kanan. */
export function Hero({ started }: { started: boolean }) {
  const { t } = useLanguage();
  const { couple, event, media } = weddingConfig;
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const photoY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -64]);

  return (
    <section
      id="home"
      ref={ref}
      className="grain relative flex min-h-[100svh] items-center overflow-hidden bg-pearl px-6 pb-24 pt-28"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_72%_28%,rgba(247,238,219,0.95),transparent_62%)]" />
      <div
        aria-hidden="true"
        className="pattern-diamond pointer-events-none absolute inset-0 opacity-40"
      />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
        {/* teks */}
        <motion.div
          variants={container}
          initial="hidden"
          animate={started ? "show" : "hidden"}
          className="order-2 flex flex-col items-center text-center lg:order-1 lg:items-start lg:text-left"
        >
          <motion.p
            variants={item}
            className="text-[11px] uppercase tracking-[0.5em] text-gold-ink"
          >
            {t.hero.label}
          </motion.p>

          <motion.h1 variants={item} className="mt-6 font-display leading-[0.95] text-night">
            <span className="block text-[clamp(3.2rem,11vw,6.4rem)]">{couple.groomName}</span>
            <span className="text-gold-foil my-1.5 block text-[clamp(1.5rem,3.5vw,2.4rem)] italic lg:pl-1">
              &amp;
            </span>
            <span className="block text-[clamp(3.2rem,11vw,6.4rem)]">{couple.brideName}</span>
          </motion.h1>

          <motion.div
            variants={item}
            className="mt-8 flex flex-col items-center gap-3 lg:items-start"
          >
            <span className="h-px w-24 bg-gold/60" aria-hidden="true" />
            <p className="font-display text-2xl text-ink-soft md:text-[1.7rem]">
              {event.weddingDayLabel}
            </p>
            <p className="text-[11px] uppercase tracking-[0.4em] text-gold-ink">
              {t.hero.location}
            </p>
          </motion.div>

          <motion.a
            variants={item}
            href="#countdown"
            aria-label={t.hero.scroll}
            className="mt-14 inline-flex items-center gap-2.5 text-[10px] font-semibold uppercase tracking-[0.4em] text-gold-ink transition-colors hover:text-night focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
          >
            {t.hero.scroll}
            <ChevronDown className="h-4 w-4 animate-float-soft" />
          </motion.a>
        </motion.div>

        {/* potret dalam bingkai lengkung */}
        <motion.div
          style={{ y: photoY }}
          className="order-1 mx-auto w-full max-w-[19rem] sm:max-w-[21rem] lg:order-2 lg:max-w-[24rem]"
        >
          <motion.div
            variants={photo}
            initial="hidden"
            animate={started ? "show" : "hidden"}
            className="relative"
          >
            <div className="arch absolute -inset-3 border border-gold/45" aria-hidden="true" />
            <div className="arch relative overflow-hidden border border-gold/70 bg-cream p-2 shadow-[0_30px_70px_rgba(13,41,30,0.16)]">
              <img
                src={media.heroImage}
                alt={`${couple.groomName} & ${couple.brideName}`}
                className="arch h-[24rem] w-full object-cover sm:h-[28rem] lg:h-[33rem]"
                style={{ objectPosition: "50% 25%" }}
              />
            </div>
            <EucalyptusSprig className="pointer-events-none absolute -bottom-8 -left-12 h-44 w-24 -rotate-12 text-sage/30" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
