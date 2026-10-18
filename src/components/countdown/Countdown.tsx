import { Reveal } from "@/components/common/Reveal";
import { SectionTitle } from "@/components/common/SectionTitle";
import { weddingConfig } from "@/data/weddingConfig";
import { useCountdown } from "@/hooks";
import { useLanguage } from "@/lib/i18n";

const pad = (value: number) => String(value).padStart(2, "0");

/** Hitung mundur menuju akad — kartu krem dengan bingkai emas tipis. */
export function Countdown() {
  const { t } = useLanguage();
  const { days, hours, minutes, seconds, done } = useCountdown(
    weddingConfig.event.weddingDate,
  );

  const cells = [
    { value: done ? 0 : days, label: t.countdown.days },
    { value: done ? 0 : hours, label: t.countdown.hours },
    { value: done ? 0 : minutes, label: t.countdown.minutes },
    { value: done ? 0 : seconds, label: t.countdown.seconds },
  ];

  return (
    <section id="countdown" className="grain relative bg-pearl px-6 pb-24 pt-4 md:pb-32 scroll-mt-16">
      <div className="relative z-10 mx-auto max-w-3xl">
        <SectionTitle eyebrow={t.countdown.eyebrow} title={t.countdown.title} />

        <Reveal delay={0.1} className="mt-11">
          {done ? (
            <p className="text-center font-display text-3xl text-gold-ink md:text-4xl">
              {t.countdown.done}
            </p>
          ) : (
            <div className="mx-auto grid max-w-xl grid-cols-4 gap-2.5 md:gap-4">
              {cells.map((cell) => (
                <div
                  key={cell.label}
                  className="rounded-xl border border-gold/40 bg-cream/85 px-1.5 py-4 text-center shadow-[0_12px_34px_rgba(13,41,30,0.06)] backdrop-blur-sm md:py-6"
                >
                  <p
                    key={`${cell.label}-${cell.value}`}
                    className="tick-pop font-display text-[1.7rem] leading-none text-night md:text-5xl"
                  >
                    {pad(cell.value)}
                  </p>
                  <p className="mt-2 text-[9px] uppercase tracking-[0.26em] text-gold-ink md:text-[10px]">
                    {cell.label}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
