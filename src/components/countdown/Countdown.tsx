import { Reveal } from "@/components/common/Reveal";
import { SectionTitle } from "@/components/common/SectionTitle";
import { weddingConfig } from "@/data/weddingConfig";
import { useCountdown } from "@/hooks";
import { useLanguage } from "@/lib/i18n";

const pad = (value: number) => String(value).padStart(2, "0");

/** Save the date — pita emerald gelap: tanggal besar + hitung mundur minimal. */
export function Countdown() {
  const { t } = useLanguage();
  const { days, hours, minutes, seconds, done } = useCountdown(
    weddingConfig.event.weddingDate,
  );
  const { event } = weddingConfig;

  const cells = [
    { value: done ? 0 : days, label: t.countdown.days },
    { value: done ? 0 : hours, label: t.countdown.hours },
    { value: done ? 0 : minutes, label: t.countdown.minutes },
    { value: done ? 0 : seconds, label: t.countdown.seconds },
  ];

  return (
    <section
      id="countdown"
      className="grain grain-dark relative overflow-hidden bg-night px-6 py-24 md:py-32 scroll-mt-16"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-10%,rgba(44,85,69,0.6),transparent_62%)]" />

      <SectionTitle
        tone="dark"
        index="01"
        eyebrow={t.countdown.eyebrow}
        title={t.countdown.title}
      />

      <div className="relative z-10 mx-auto mt-14 max-w-5xl border-t border-cream/10 pt-10 md:pt-14">
        <div className="grid items-center gap-10 md:grid-cols-[1fr_auto] md:gap-16">
          <Reveal>
            <p className="text-gold-foil font-display text-[clamp(2.4rem,8vw,4rem)] leading-none">
              {event.weddingDateLabel}
            </p>
            <p className="mt-4 text-[11px] uppercase tracking-[0.4em] text-sage-light">
              {t.event.day}
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            {done ? (
              <p className="font-display text-2xl leading-snug text-gold md:text-3xl">
                {t.countdown.done}
              </p>
            ) : (
              <div className="grid grid-cols-4 gap-5 md:gap-9">
                {cells.map((cell) => (
                  <div key={cell.label} className="text-center md:text-left">
                    <p
                      key={`${cell.label}-${cell.value}`}
                      className="tick-pop font-display text-3xl leading-none text-cream md:text-5xl"
                    >
                      {pad(cell.value)}
                    </p>
                    <p className="mt-2.5 text-[9px] uppercase tracking-[0.28em] text-gold md:text-[10px]">
                      {cell.label}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
