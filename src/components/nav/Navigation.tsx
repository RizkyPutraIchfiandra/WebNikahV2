import { motion, useScroll, useSpring } from "framer-motion";
import {
  ArrowUp,
  BookOpen,
  CalendarDays,
  Gift as GiftIcon,
  Heart,
  House,
  Images,
  Leaf,
  Mail,
} from "lucide-react";

import { LanguageToggle } from "@/components/common/LanguageToggle";
import { useActiveSection, useScrolledPast } from "@/hooks";
import { useLanguage } from "@/lib/i18n";

type SectionId = "home" | "couple" | "story" | "event" | "gallery" | "gift" | "rsvp";

const SECTIONS: SectionId[] = ["home", "couple", "story", "event", "gallery", "gift", "rsvp"];

const ICONS: Record<SectionId, typeof House> = {
  home: House,
  couple: Heart,
  story: BookOpen,
  event: CalendarDays,
  gallery: Images,
  gift: GiftIcon,
  rsvp: Mail,
};

/**
 * Navigasi mengapung: titik label di kanan (desktop), bilah ikon di bawah
 * (mobile), progress emas di atas, tombol bahasa, dan kembali ke atas.
 */
export function Navigation() {
  const { t } = useLanguage();
  const active = useActiveSection(SECTIONS);
  const showBackToTop = useScrolledPast(900);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });

  const labels: Record<SectionId, string> = {
    home: t.navigation.home,
    couple: t.navigation.couple,
    story: t.navigation.story,
    event: t.navigation.event,
    gallery: t.navigation.gallery,
    gift: t.navigation.gift,
    rsvp: t.navigation.rsvp,
  };

  const toTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <>
      {/* progress gulir */}
      <motion.div
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-0 z-50 h-[3px] origin-left bg-gradient-to-r from-gold-deep via-gold to-gold-soft"
        aria-hidden="true"
      />

      {/* tombol bahasa */}
      <LanguageToggle className="fixed right-4 top-4 z-40" />

      {/* navigasi desktop */}
      <nav
        aria-label={t.navigation.aria}
        className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 lg:block"
      >
        <ul className="flex flex-col items-center gap-1 rounded-full border border-gold/25 bg-night/85 px-2 py-3 backdrop-blur-sm">
          {SECTIONS.map((id) => {
            const Icon = ICONS[id];
            const isActive = active === id;
            return (
              <li key={id}>
                <a
                  href={`#${id}`}
                  aria-label={labels[id]}
                  aria-current={isActive ? "true" : undefined}
                  className={`group relative grid h-10 w-10 place-items-center rounded-full transition-colors ${
                    isActive
                      ? "bg-gold/90 text-night"
                      : "text-sage-light hover:bg-gold/20 hover:text-gold"
                  }`}
                >
                  <Icon className="h-[18px] w-[18px]" />
                  <span className="pointer-events-none absolute right-12 whitespace-nowrap rounded-md border border-gold/25 bg-night/95 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-cream opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    {labels[id]}
                  </span>
                </a>
              </li>
            );
          })}
          <li className="mt-1 border-t border-gold/20 pt-2">
            <button
              type="button"
              onClick={toTop}
              aria-label={t.misc.backToTop}
              className="grid h-10 w-10 cursor-pointer place-items-center rounded-full text-sage-light transition-colors hover:bg-gold/20 hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              <ArrowUp className="h-[18px] w-[18px]" />
            </button>
          </li>
        </ul>
      </nav>

      {/* navigasi mobile */}
      <nav
        aria-label={t.navigation.aria}
        className="fixed inset-x-0 bottom-0 z-40 border-t border-gold/20 bg-night pb-[env(safe-area-inset-bottom)] lg:hidden"
      >
        <ul className="mx-auto grid max-w-lg grid-cols-7">
          {SECTIONS.map((id) => {
            const Icon = ICONS[id];
            const isActive = active === id;
            return (
              <li key={id}>
                <a
                  href={`#${id}`}
                  aria-label={labels[id]}
                  aria-current={isActive ? "true" : undefined}
                  className={`flex flex-col items-center gap-1 pb-2.5 pt-2.5 transition-colors ${
                    isActive ? "text-gold" : "text-sage-light"
                  }`}
                >
                  <Icon className="h-[18px] w-[18px]" />
                  <span className="max-w-full truncate px-0.5 text-[9px] uppercase tracking-wide">
                    {labels[id]}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* kembali ke atas (mobile, ikon daun) */}
      {showBackToTop && (
        <motion.button
          type="button"
          onClick={toTop}
          aria-label={t.misc.backToTop}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed bottom-24 left-4 z-40 grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-gold/30 bg-night/90 text-gold backdrop-blur-sm transition-colors hover:bg-night focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold lg:hidden"
        >
          <Leaf className="h-4 w-4" />
        </motion.button>
      )}
    </>
  );
}
