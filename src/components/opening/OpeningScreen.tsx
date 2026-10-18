import { motion } from "framer-motion";
import { MailOpen } from "lucide-react";

import { EASE } from "@/components/common/Reveal";
import { FallingLeaves } from "@/components/ornaments/FallingLeaves";
import { LeafDivider } from "@/components/ornaments/ornaments";
import { weddingConfig } from "@/data/weddingConfig";
import { useLanguage } from "@/lib/i18n";

/* Layar pembuka selalu menampilkan dua bahasa sekaligus —
   pemilih bahasa baru tersedia setelah undangan dibuka. */
const copy = {
  eyebrowId: "Undangan Pernikahan",
  eyebrowEn: "Wedding Invitation",
  addressed: "Kepada / To",
  open: "Buka Undangan",
  openEn: "Open Invitation",
  musicId: "Musik akan diputar setelah undangan dibuka",
  musicEn: "Music will play once the invitation is opened",
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.25 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 1, ease: EASE } },
};

/** Layar pembuka: foto pengantin sinematik + kartu undangan dua bahasa. */
export function OpeningScreen({
  guestName,
  onOpen,
}: {
  guestName: string;
  onOpen: () => void;
}) {
  const { t } = useLanguage();
  const { couple, event, media } = weddingConfig;

  return (
    <motion.div
      exit={{ opacity: 0, scale: 1.03 }}
      transition={{ duration: 0.9, ease: EASE }}
      className="grain grain-dark fixed inset-0 z-[60] overflow-hidden bg-night"
      role="dialog"
      aria-label={t.opening.aria}
    >
      {/* foto pengantin sebagai kanvas */}
      <img
        src={media.openingImage}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover opacity-80"
        style={{ objectPosition: "50% 24%" }}
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-night/75 via-night/40 to-night"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_18%,rgba(8,29,21,0.6)_100%)]"
        aria-hidden="true"
      />

      <FallingLeaves tone="dark" count={8} />

      <div className="relative z-10 flex h-full flex-col items-center justify-center overflow-y-auto px-6 py-10">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex w-full max-w-md flex-col items-center text-center"
        >
          <motion.p
            variants={item}
            className="text-[10px] uppercase tracking-[0.42em] text-gold"
          >
            {copy.eyebrowId}
          </motion.p>
          <motion.p
            variants={item}
            className="mt-1.5 text-[9px] uppercase tracking-[0.3em] text-sage-light"
          >
            {copy.eyebrowEn}
          </motion.p>

          <motion.h1
            variants={item}
            className="mt-5 font-display text-[clamp(2.6rem,10vw,3.9rem)] leading-[1.05] text-cream"
          >
            {couple.groomName}
            <span className="text-gold-foil mx-2.5 inline-block italic">&amp;</span>
            {couple.brideName}
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-3 text-[11px] uppercase tracking-[0.34em] text-sage-light"
          >
            {event.weddingDateLabel}
          </motion.p>

          <motion.div variants={item} className="mt-6">
            <LeafDivider className="h-4 w-36 text-gold/60" />
          </motion.div>

          <motion.div
            variants={item}
            className="glass-dark mt-8 w-full max-w-sm rounded-2xl px-7 py-6"
          >
            <p className="text-[10px] uppercase tracking-[0.32em] text-sage-light">
              {copy.addressed}
            </p>
            <p className="mt-2.5 font-display text-[1.9rem] leading-snug text-gold">
              {guestName || t.opening.guest}
            </p>
          </motion.div>

          <motion.button
            variants={item}
            type="button"
            onClick={onOpen}
            className="btn-shine group relative mt-8 inline-flex cursor-pointer items-center gap-3.5 overflow-hidden rounded-full border border-gold/70 bg-gold/10 px-8 py-3.5 transition-colors duration-300 hover:bg-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
          >
            <MailOpen className="h-4 w-4 text-gold transition-colors duration-300 group-hover:text-night" />
            <span className="flex flex-col items-start leading-none">
              <span className="text-[11px] font-semibold uppercase tracking-[0.26em] text-gold transition-colors duration-300 group-hover:text-night">
                {copy.open}
              </span>
              <span className="mt-1 text-[8.5px] uppercase tracking-[0.2em] text-gold/70 transition-colors duration-300 group-hover:text-night/70">
                {copy.openEn}
              </span>
            </span>
          </motion.button>

          <motion.p
            variants={item}
            className="mt-6 max-w-xs text-[10px] leading-relaxed text-sage-soft"
          >
            {copy.musicId}
            <br />
            {copy.musicEn}
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  );
}
