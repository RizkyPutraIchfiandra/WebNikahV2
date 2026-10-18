import { Reveal } from "@/components/common/Reveal";
import { SectionTitle } from "@/components/common/SectionTitle";
import { EucalyptusSprig } from "@/components/ornaments/ornaments";
import { useLanguage } from "@/lib/i18n";

/** Kisah kami — bab bernomor dengan pemisah garis, gaya majalah. */
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

      <ol className="relative z-10 mx-auto mt-16 max-w-5xl">
        {t.story.chapters.map((chapter, index) => (
          <li
            key={chapter.title}
            className={
              index === 0
                ? ""
                : "mt-12 border-t border-cream/10 pt-12 md:mt-16 md:pt-16"
            }
          >
            <Reveal delay={0.05}>
              <div className="grid gap-4 md:grid-cols-[7rem_1fr] md:gap-12">
                <p className="font-display text-5xl leading-none text-gold/30 md:text-6xl">
                  0{index + 1}
                </p>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.4em] text-gold">
                    {chapter.year}
                  </p>
                  <h3 className="mt-2.5 font-display text-3xl text-cream md:text-4xl">
                    {chapter.title}
                  </h3>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-sage-light">
                    {chapter.text}
                  </p>
                </div>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}
