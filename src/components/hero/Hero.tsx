import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useRef } from "react";

import { EASE } from "@/components/common/Reveal";
import { CornerSpray, LeafDivider } from "@/components/ornaments/ornaments";
import { weddingConfig } from "@/data/weddingConfig";
import { useLanguage } from "@/lib/i18n";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15, delayChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 1.15, ease: EASE } },
};

/** Hero sinematik: nama, tanggal, ornamen parallax. */
export function Hero({ started }: { started: boolean }) {
  const { t } = useLanguage();
  const { couple } = weddingConfig;
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const ornamentY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 90]);

  return (
    <section
      id="home"
      ref={ref}
      className="grain relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-pearl px-6 pb-20 pt-24 text-center"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(247,238,219,0.95),transparent_58%)]" />

      <motion.div style={{ y: ornamentY }} className="pointer-events-none absolute inset-0">
        <CornerSpray className="absolute -left-24 -top-24 h-64 w-64 text-sage/25 md:h-[26rem] md:w-[26rem]" />
        <CornerSpray className="absolute -right-24 -top-24 h-64 w-64 -scale-x-100 text-sage/25 md:h-[26rem] md:w-[26rem]" />
      </motion.div>

      {/* monogram air di belakang nama */}
      <p
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none font-display text-[32vw] leading-none text-night/[0.035]"
      >
        D&amp;I
      </p>

      <motion.div
        variants={container}
        initial="hidden"
        animate={started ? "show" : "hidden"}
        className="relative z-10 flex w-full max-w-3xl flex-col items-center"
      >
        <motion.p
          variants={item}
          className="text-[11px] uppercase tracking-[0.5em] text-gold-ink"
        >
          {t.opening.wedding}
        </motion.p>

        <motion.h1
          variants={item}
          className="mt-5 font-display text-[clamp(3rem,14vw,7rem)] leading-[0.95] text-night"
        >
          {couple.groomName}
          <span className="text-gold-foil mx-3 inline-block italic">&</span>
          {couple.brideName}
        </motion.h1>

        <motion.div variants={item} className="mt-7">
          <LeafDivider className="h-6 w-56 text-gold-deep" />
        </motion.div>

        <motion.p
          variants={item}
          className="mt-7 font-display text-2xl text-ink-soft md:text-3xl"
        >
          {t.event.day}
        </motion.p>

        <motion.a
          variants={item}
          href="#countdown"
          aria-label={t.hero.scroll}
          className="mt-16 flex flex-col items-center gap-1.5 text-gold-ink transition-colors hover:text-night focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
        >
          <span className="text-[10px] uppercase tracking-[0.4em]">{t.hero.scroll}</span>
          <ChevronDown className="h-4 w-4 animate-float-soft" />
        </motion.a>
      </motion.div>
    </section>
  );
}
