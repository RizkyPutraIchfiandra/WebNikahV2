import { motion } from "framer-motion";
import { MailOpen, MapPin } from "lucide-react";

import { EASE } from "@/components/common/Reveal";
import { FallingLeaves } from "@/components/ornaments/FallingLeaves";
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
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.35 } },
};

const item = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 1, ease: EASE } },
};

/**
 * Layar pembuka "Emerald Suite" — panel emerald berbingkai emas ganda
 * berdampingan dengan foto sinematik. Mobile: foto atas + panel bawah,
 * dari 768px (iPad portrait) ke atas: split dua panel seperti desktop.
 */
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
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.9, ease: EASE }}
      className="grain grain-dark fixed inset-0 z-[60] flex flex-col overflow-hidden bg-night md:flex-row"
      role="dialog"
      aria-label={t.opening.aria}
    >
      <FallingLeaves tone="dark" count={10} />

      {/* ————— Foto sinematik ————— */}
      <div className="opening-photo relative w-full shrink-0 overflow-hidden md:order-2 md:w-[44%]">
        <motion.img
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.7, ease: EASE }}
          src={media.openingImage}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: "50% 24%" }}
        />

        {/* jahitan panel ↔ foto */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-night/45 via-transparent to-night md:bg-gradient-to-r md:from-night md:via-night/10 md:to-transparent"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(8,29,21,0.62)_100%)]"
        />
        {/* garis emas di tepi jahitan (tablet & desktop) */}
        <span
          aria-hidden="true"
          className="absolute inset-y-12 left-0 hidden w-px bg-gradient-to-b from-transparent via-gold/45 to-transparent md:block"
        />

        {/* chip lokasi */}
        <div className="glass-dark absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full border border-gold/30 px-4 py-2 text-[9.5px] uppercase tracking-[0.3em] text-cream/90 md:bottom-10 md:left-9 md:right-auto">
          <MapPin className="h-3 w-3 text-gold" />
          {t.hero.location}
        </div>
      </div>

      {/* ————— Panel emerald ————— */}
      <div className="relative flex min-h-0 flex-1 md:order-1">
        <div
          aria-hidden="true"
          className="pattern-diamond pointer-events-none absolute inset-0 opacity-50"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_28%_10%,rgba(212,175,55,0.09),transparent_55%)]"
        />

        {/* bingkai ganda stationery (semua ukuran layar) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-3 border border-gold/20 md:inset-6"
        >
          <div className="absolute inset-1.5 border border-gold/10 md:inset-2.5" />
          <span className="absolute -top-[3px] left-1/2 h-[5px] w-[5px] -translate-x-1/2 rotate-45 bg-gold/60" />
          <span className="absolute -bottom-[3px] left-1/2 h-[5px] w-[5px] -translate-x-1/2 rotate-45 bg-gold/60" />
        </div>

        <div className="custom-scroll relative z-10 flex min-h-0 flex-1 flex-col overflow-y-auto">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="relative mx-auto my-auto flex w-full max-w-md flex-col items-start px-8 py-8 md:max-w-[32rem] md:px-12 md:py-14 lg:max-w-[40rem] lg:px-12 lg:py-16"
          >
            {/* label dua bahasa */}
            <motion.div variants={item} className="flex items-center gap-3.5">
              <span aria-hidden="true" className="h-px w-8 bg-gold/60 md:w-10" />
              <div>
                <p className="text-[10px] uppercase tracking-[0.4em] text-gold md:text-[11px]">
                  {copy.eyebrowId}
                </p>
                <p className="mt-1 text-[8.5px] uppercase tracking-[0.3em] text-sage-light md:text-[9.5px]">
                  {copy.eyebrowEn}
                </p>
              </div>
            </motion.div>

            {/* nama */}
            <motion.h1
              variants={item}
              className="mt-6 font-display leading-[0.95] text-cream md:mt-8"
            >
              <span className="block text-[clamp(2.5rem,7.5vw,6rem)]">
                {couple.groomName}
              </span>
              <span className="text-gold-foil my-1.5 block pl-1 text-[clamp(1.3rem,3vw,2.6rem)] italic md:my-2">
                &amp;
              </span>
              <span className="block text-[clamp(2.5rem,7.5vw,6rem)]">
                {couple.brideName}
              </span>
            </motion.h1>

            {/* tanggal */}
            <motion.div
              variants={item}
              className="mt-6 flex items-center gap-4 md:mt-8"
            >
              <span aria-hidden="true" className="h-px w-12 bg-gold/50 md:w-14" />
              <p className="text-[11px] uppercase tracking-[0.4em] text-gold-soft md:text-[12px]">
                {event.weddingDateLabel}
              </p>
            </motion.div>

            {/* plakat tamu — bingkai dobel gaya stationery */}
            <motion.div
              variants={item}
              className="relative mt-7 w-full md:mt-10"
            >
              <span
                aria-hidden="true"
                className="absolute -inset-1.5 border border-gold/15"
              />
              <div className="relative border border-gold/40 bg-night/45 px-6 py-4 backdrop-blur-sm md:px-8 md:py-6">
                <p className="text-[9.5px] uppercase tracking-[0.36em] text-gold/75 md:text-[10px]">
                  {copy.addressed}
                </p>
                <p className="mt-1.5 font-display text-[1.7rem] leading-snug text-gold md:mt-2 md:text-[2.1rem]">
                  {guestName || t.opening.guest}
                </p>
              </div>
            </motion.div>

            {/* tombol buka — emas penuh */}
            <motion.button
              variants={item}
              type="button"
              onClick={onOpen}
              className="group mt-7 inline-flex cursor-pointer items-center gap-4 rounded-full bg-gradient-to-r from-gold-soft via-gold to-gold-deep px-7 py-3.5 text-night shadow-[0_16px_40px_rgba(212,175,55,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_50px_rgba(212,175,55,0.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold md:mt-9 md:px-10 md:py-[1.1rem]"
            >
              <MailOpen className="h-4 w-4 md:h-[18px] md:w-[18px]" />
              <span className="flex flex-col items-start leading-none">
                <span className="text-[11px] font-semibold uppercase tracking-[0.26em] md:text-[12px]">
                  {copy.open}
                </span>
                <span className="mt-1 text-[8.5px] uppercase tracking-[0.22em] opacity-70 md:text-[9.5px]">
                  {copy.openEn}
                </span>
              </span>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
