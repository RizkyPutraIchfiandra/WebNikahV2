import { Reveal } from "@/components/common/Reveal";
import { SectionTitle } from "@/components/common/SectionTitle";
import { EucalyptusSprig } from "@/components/ornaments/ornaments";
import { useLanguage } from "@/lib/i18n";

/** Kisah kami — garis waktu zigzag dengan titik emas di tiap bab. */
export function LoveStory() {
  const { t } = useLanguage();

  return (
    <section
      id="story"
      className="grain grain-dark relative overflow-hidden bg-night px-6 py-24 md:py-32 scroll-mt-16"
    >
      <EucalyptusSprig className="pointer-events-none absolute -left-12 top-12 h-72 w-36 rotate-[16deg] text-sage/20 md:h-96 md:w-48" />
      <EucalyptusSprig className="pointer-events-none absolute -right-12 bottom-12 h-72 w-36 -rotate-[16deg] -scale-x-100 text-sage/20 md:h-96 md:w-48" />

      <SectionTitle tone="dark" index="03" eyebrow={t.story.eyebrow} title={t.story.title} />

      <ol className="relative z-10 mx-auto mt-16 max-w-4xl">
        {/* garis waktu: di kiri pada ponsel, di tengah pada layar lebar */}
        <span
          aria-hidden="true"
          className="absolute bottom-3 left-[9px] top-3 w-px bg-gradient-to-b from-transparent via-gold/30 to-transparent md:left-1/2 md:-translate-x-1/2"
        />
        {t.story.chapters.map((chapter, index) => {
          const toRight = index % 2 === 1;
          return (
            <li key={chapter.title} className={index === 0 ? "" : "mt-14 md:mt-20"}>
              <Reveal delay={0.05}>
                <div className="relative pl-10 md:grid md:grid-cols-2 md:gap-16 md:pl-0">
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-1 grid h-[19px] w-[19px] place-items-center rounded-full border border-gold/40 bg-night md:left-1/2 md:-translate-x-1/2"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                  </span>
                  <div
                    className={
                      toRight ? "md:col-start-2 md:text-left" : "md:col-start-1 md:text-right"
                    }
                  >
                    <p className="text-[11px] uppercase tracking-[0.4em] text-gold">
                      {chapter.year}
                    </p>
                    <h3 className="mt-2.5 font-display text-3xl text-cream md:text-4xl">
                      {chapter.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-sage-light">{chapter.text}</p>
                  </div>
                </div>
              </Reveal>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
