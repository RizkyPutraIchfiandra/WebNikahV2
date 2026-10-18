import { CalendarPlus, Gem, GlassWater, Navigation } from "lucide-react";

import { Reveal } from "@/components/common/Reveal";
import { SectionTitle } from "@/components/common/SectionTitle";
import { useToast } from "@/components/common/Toast";
import { CornerSpray, EucalyptusSprig, LeafDivider } from "@/components/ornaments/ornaments";
import { weddingConfig } from "@/data/weddingConfig";
import { downloadWeddingIcs } from "@/lib/ics";
import { useLanguage } from "@/lib/i18n";

import { VenueMap } from "./VenueMap";

/** Rangkaian acara — kartu "Waktu" & "Tempat" bergaya editorial, plus peta. */
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
      className="grain relative scroll-mt-16 overflow-hidden bg-champagne px-6 py-24 md:py-32"
    >
      {/* sebaran botani agar tidak polos */}
      <CornerSpray className="pointer-events-none absolute right-0 top-6 hidden h-64 w-64 scale-x-[-1] text-sage/20 md:block" />
      <CornerSpray className="pointer-events-none absolute bottom-6 left-0 hidden h-64 w-64 scale-y-[-1] text-sage/20 md:block" />
      <EucalyptusSprig className="pointer-events-none absolute -left-10 top-1/3 hidden h-80 w-40 rotate-[14deg] text-sage/20 lg:block" />
      <EucalyptusSprig className="pointer-events-none absolute -right-10 bottom-1/4 hidden h-80 w-40 -rotate-[14deg] -scale-x-100 text-sage/20 lg:block" />

      <SectionTitle
        index="04"
        eyebrow={t.event.eyebrow}
        title={t.event.title}
        subtitle={t.event.subtitle}
      />

      <div className="relative z-10 mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-2 md:gap-8">
        {/* ————— Waktu ————— */}
        <Reveal>
          <article className="relative flex h-full flex-col overflow-hidden rounded-[26px] border border-gold/40 bg-cream px-8 py-10 shadow-[0_18px_50px_rgba(13,41,30,0.07)] md:px-11 md:py-12">
            <EucalyptusSprig className="pointer-events-none absolute -right-3 -top-4 h-32 w-16 rotate-[18deg] text-sage/15" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-gold-ink">
              {t.event.whenLabel}
            </p>

            <p className="mt-5 font-display text-[clamp(2.3rem,7vw,3.7rem)] leading-none text-night">
              {event.weddingDateLabel}
            </p>
            <p className="mt-4 text-[11px] uppercase tracking-[0.34em] text-ink-soft">
              {t.event.day}
            </p>

            <div className="mt-9 space-y-7 border-t border-dashed border-gold/40 pt-9">
              {celebrations.map((celebration) => (
                <div key={celebration.title} className="flex items-center gap-5">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-gold/40 bg-champagne">
                    <celebration.icon
                      className="h-5 w-5 text-gold-deep"
                      strokeWidth={1.5}
                    />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-2xl text-night">
                      {celebration.title}
                    </h3>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-ink-soft">
                      {celebration.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </Reveal>

        {/* ————— Tempat ————— */}
        <Reveal delay={0.1}>
          <article className="relative flex h-full flex-col overflow-hidden rounded-[26px] border border-gold/40 bg-cream px-8 py-10 shadow-[0_18px_50px_rgba(13,41,30,0.07)] md:px-11 md:py-12">
            <EucalyptusSprig className="pointer-events-none absolute -right-3 -top-4 h-32 w-16 -rotate-[18deg] -scale-x-100 text-sage/15" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-gold-ink">
              {t.event.whereLabel}
            </p>

            <h3 className="mt-5 font-display text-3xl leading-snug text-night md:text-4xl">
              {t.event.venue}
            </h3>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-soft">
              {t.event.address}
            </p>

            <div className="mt-9 flex flex-wrap gap-3 border-t border-dashed border-gold/40 pt-9 md:mt-auto">
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
            </div>

            <p className="mt-5 text-[10.5px] leading-relaxed text-ink-soft/90">
              {t.event.calendarHelp}
            </p>
          </article>
        </Reveal>
      </div>

      <Reveal delay={0.15} className="relative z-10 mx-auto mt-12 max-w-5xl">
        <LeafDivider className="mx-auto mb-9 h-5 w-44 text-gold/60" />
        <VenueMap />
      </Reveal>
    </section>
  );
}
