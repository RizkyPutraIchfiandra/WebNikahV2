import { motion } from "framer-motion";
import { MailOpen } from "lucide-react";

import { EASE } from "@/components/common/Reveal";
import { FallingLeaves } from "@/components/ornaments/FallingLeaves";
import { CornerSpray, LeafDivider, MonogramSeal } from "@/components/ornaments/ornaments";
import { weddingConfig } from "@/data/weddingConfig";
import { useLanguage } from "@/lib/i18n";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.16, delayChildren: 0.3 } },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 1.05, ease: EASE } },
};

/** Layar pembuka sinematik — hijau emerald, ornamen botani, personalisasi tamu. */
export function OpeningScreen({
  guestName,
  onOpen,
}: {
  guestName: string;
  onOpen: () => void;
}) {
  const { t } = useLanguage();
  const { couple, event } = weddingConfig;

  return (
    <motion.div
      exit={{ opacity: 0, scale: 1.035 }}
      transition={{ duration: 0.9, ease: EASE }}
      className="grain grain-dark fixed inset-0 z-[60] flex flex-col items-center justify-center overflow-hidden bg-night px-6 py-10 text-center"
      role="dialog"
      aria-label={t.opening.aria}
    >
      {/* cahaya & gradasi latar */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(44,85,69,0.6),transparent_62%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-night-deep to-transparent" />

      {/* ornamen sudut */}
      <CornerSpray className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 text-sage/70 md:h-96 md:w-96" />
      <CornerSpray className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 -scale-x-100 text-sage/70 md:h-96 md:w-96" />
      <CornerSpray className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 -scale-y-100 text-sage/50 md:h-96 md:w-96" />
      <CornerSpray className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 -scale-100 text-sage/50 md:h-96 md:w-96" />

      {/* daun jatuh lokal (lebih lebat di layar pembuka) */}
      <FallingLeaves tone="dark" count={10} />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 flex w-full max-w-xl flex-col items-center"
      >
        <motion.div variants={item}>
          <MonogramSeal
            className="h-24 w-24 text-gold md:h-28 md:w-28"
            label={`${couple.groomName} & ${couple.brideName}`}
          />
        </motion.div>

        <motion.p
          variants={item}
          className="mt-8 text-[11px] uppercase tracking-[0.5em] text-gold"
        >
          {t.opening.wedding}
        </motion.p>

        <motion.h1
          variants={item}
          className="mt-4 font-display text-[clamp(2.9rem,12vw,5rem)] leading-[1.02] text-cream"
        >
          {couple.groomName}
          <span className="text-gold-foil mx-3 inline-block italic">&</span>
          {couple.brideName}
        </motion.h1>

        <motion.div variants={item} className="mt-6">
          <LeafDivider className="h-5 w-44 text-gold/75" />
        </motion.div>

        <motion.p
          variants={item}
          className="mt-5 text-sm uppercase tracking-[0.4em] text-gold-soft"
        >
          {event.weddingDateLabel}
        </motion.p>

        <motion.div
          variants={item}
          className="glass-dark mt-10 w-full max-w-sm rounded-2xl px-6 py-6"
        >
          <p className="text-[11px] uppercase tracking-[0.3em] text-sage-light">
            {t.opening.addressed}
          </p>
          <p className="mt-3 font-display text-3xl leading-snug text-gold">
            {guestName || t.opening.guest}
          </p>
        </motion.div>

        <motion.button
          variants={item}
          type="button"
          onClick={onOpen}
          className="btn-shine group relative mt-10 inline-flex cursor-pointer items-center gap-3 overflow-hidden rounded-full border border-gold/70 bg-gold/10 px-9 py-4 text-[12px] font-semibold uppercase tracking-[0.3em] text-gold transition-colors duration-300 hover:bg-gold hover:text-night focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
        >
          <MailOpen className="h-4 w-4 transition-transform duration-300 group-hover:-rotate-6" />
          {t.opening.open}
        </motion.button>

        <motion.p
          variants={item}
          className="mt-7 max-w-xs text-[10px] leading-relaxed text-sage-soft"
        >
          {t.opening.note}
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
