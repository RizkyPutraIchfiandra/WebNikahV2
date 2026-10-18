import { CalendarPlus, Gem, GlassWater, Navigation } from "lucide-react";

import { Reveal } from "@/components/common/Reveal";
import { SectionTitle } from "@/components/common/SectionTitle";
import { useToast } from "@/components/common/Toast";
import { weddingConfig } from "@/data/weddingConfig";
import { downloadWeddingIcs } from "@/lib/ics";
import { useLanguage } from "@/lib/i18n";

import { VenueMap } from "./VenueMap";

/** Rangkaian acara — kartu gaya tiket dengan perforasi, plus kalender & peta. */
export function EventDetails() {
  const { t } = useLanguage();
  const toast = useToast();
  const { event } = weddingConfig;

  const onCalendar = () => {
    downloadWeddingIcs({
      title: t.event.calendarTitle,
      description: t.event.calendarDescription,
      alarmDay: t.event.alarmDay,
      alarmHours: t.event.alarmHours,
    });
    toast(t.event.calendarToast);
  };

  const celebrations = [
    { icon: Gem, title: t.event.ceremony, time: t.event.ceremonyTime },
    { icon: GlassWater, title: t.event.reception, time: t.event.receptionTime },
  ];

  return (
    <section
      id="event"
      className="grain relative scroll-mt-16 bg-champagne px-6 py-24 md:py-32"
    >
      <SectionTitle
        eyebrow={t.event.eyebrow}
        title={t.event.title}
        subtitle={t.event.subtitle}
      />

      <div className="relative z-10 mx-auto mt-14 grid max-w-4xl gap-6 md:grid-cols-2">
        {celebrations.map((celebration, index) => (
          <Reveal key={celebration.title} delay={index * 0.1}>
            <article className="relative h-full overflow-hidden rounded-[20px] border border-gold/40 bg-cream px-8 py-10 text-center shadow-[0_18px_50px_rgba(13,41,30,0.08)]">
              {/* perforasi tiket */}
              <span
                aria-hidden="true"
                className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-champagne"
              />
              <span
                aria-hidden="true"
                className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-champagne"
              />

              <celebration.icon
                className="mx-auto h-7 w-7 text-gold-deep"
                strokeWidth={1.5}
              />
              <h3 className="mt-4 font-display text-3xl text-night">
                {celebration.title}
              </h3>
              <p className="mt-2 text-[11px] uppercase tracking-[0.3em] text-gold-ink">
                {t.event.day}
              </p>
              <p className="mt-1.5 text-sm text-ink-soft">{celebration.time}</p>

              <div className="mx-auto mt-7 w-44 border-t border-dashed border-gold/50" />

              <p className="mt-7 font-display text-2xl text-night">
                {t.event.venue}
              </p>
              <p className="mx-auto mt-2.5 max-w-xs text-xs leading-relaxed text-ink-soft">
                {t.event.address}
              </p>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal
        delay={0.1}
        className="relative z-10 mx-auto mt-11 flex max-w-4xl flex-wrap items-center justify-center gap-4"
      >
        <button
          type="button"
          onClick={onCalendar}
          className="inline-flex cursor-pointer items-center gap-2.5 rounded-full bg-sage px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-cream transition-colors duration-300 hover:bg-night focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
        >
          <CalendarPlus className="h-4 w-4" />
          {t.event.calendarButton}
        </button>
        <a
          href={event.mapsUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2.5 rounded-full border border-gold/60 px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-ink transition-colors duration-300 hover:bg-gold/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
        >
          <Navigation className="h-4 w-4" />
          {t.event.directions}
        </a>
      </Reveal>

      <p className="relative z-10 mx-auto mt-5 max-w-md text-center text-[11px] leading-relaxed text-ink-soft">
        {t.event.calendarHelp}
      </p>

      <Reveal delay={0.15} className="relative z-10 mx-auto mt-12 max-w-4xl">
        <VenueMap />
      </Reveal>
    </section>
  );
}
