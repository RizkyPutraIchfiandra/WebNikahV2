import { Reveal } from "@/components/common/Reveal";
import { EucalyptusSprig, LeafDivider } from "@/components/ornaments/ornaments";
import { weddingConfig } from "@/data/weddingConfig";
import { useLanguage } from "@/lib/i18n";

/** Ayat pembuka — QS. Ar-Rum: 21 dengan tipografi Arab yang lapang. */
export function Quote() {
  const { language } = useLanguage();
  const { quote } = weddingConfig;

  return (
    <section className="grain relative overflow-hidden bg-champagne px-6 py-24 md:py-32">
      <EucalyptusSprig className="pointer-events-none absolute -left-10 top-6 h-64 w-32 rotate-[14deg] text-sage/20 md:h-96 md:w-48" />
      <EucalyptusSprig className="pointer-events-none absolute -right-10 bottom-6 h-64 w-32 -rotate-[14deg] -scale-x-100 text-sage/20 md:h-96 md:w-48" />

      <Reveal className="relative z-10 mx-auto max-w-3xl text-center">
        <p
          dir="rtl"
          lang="ar"
          className="font-arabic text-[1.5rem] leading-[2.35] text-night md:text-[2rem] md:leading-[2.5]"
        >
          {quote.arabic}
        </p>

        <div className="mt-10 flex items-center justify-center gap-5">
          <span className="h-px w-12 bg-gold/50" aria-hidden="true" />
          <LeafDivider className="h-5 w-36 text-gold-deep" />
          <span className="h-px w-12 bg-gold/50" aria-hidden="true" />
        </div>

        <p className="mx-auto mt-7 max-w-2xl text-sm leading-relaxed text-ink-soft md:text-base">
          “{language === "id" ? quote.textId : quote.textEn}”
        </p>

        <p className="mt-7 text-[11px] uppercase tracking-[0.4em] text-gold-ink">
          {quote.source}
        </p>
      </Reveal>
    </section>
  );
}
