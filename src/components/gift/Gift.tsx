import { Check, Copy, Landmark, QrCode } from "lucide-react";
import { useState } from "react";

import { Reveal } from "@/components/common/Reveal";
import { SectionTitle } from "@/components/common/SectionTitle";
import { useToast } from "@/components/common/Toast";
import { EucalyptusSprig } from "@/components/ornaments/ornaments";
import { weddingConfig } from "@/data/weddingConfig";
import { copyText } from "@/lib/clipboard";
import { useLanguage } from "@/lib/i18n";

/** Hadiah pernikahan — kartu rekening dengan tombol salin + slot QRIS siap pakai. */
export function Gift() {
  const { t } = useLanguage();
  const toast = useToast();
  const { gift } = weddingConfig;
  const [copied, setCopied] = useState<number | null>(null);

  const handleCopy = async (number: string, index: number) => {
    try {
      await copyText(number);
      setCopied(index);
      toast(t.gift.copySuccess);
      window.setTimeout(
        () => setCopied((current) => (current === index ? null : current)),
        2200,
      );
    } catch {
      toast(t.gift.copyError);
    }
  };

  return (
    <section
      id="gift"
      className="grain relative scroll-mt-16 overflow-hidden bg-champagne px-6 py-24 md:py-32"
    >
      <EucalyptusSprig className="pointer-events-none absolute -left-12 top-16 h-64 w-32 rotate-[18deg] text-sage/20 md:h-96 md:w-48" />
      <EucalyptusSprig className="pointer-events-none absolute -right-12 bottom-16 h-64 w-32 -rotate-[18deg] -scale-x-100 text-sage/20 md:h-96 md:w-48" />

      <SectionTitle
        index="06"
        eyebrow={t.gift.eyebrow}
        title={t.gift.title}
        subtitle={t.gift.note}
      />

      <div className="relative z-10 mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-2 md:gap-8">
        {gift.banks.map((bank, index) => (
          <Reveal key={bank.bank} delay={index * 0.1}>
            <article className="flex h-full flex-col rounded-[26px] border border-gold/40 bg-cream px-8 py-9 shadow-[0_18px_50px_rgba(13,41,30,0.07)] md:px-10">
              <div className="flex items-center justify-between gap-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold-ink">
                  {bank.bank}
                </p>
                <Landmark className="h-5 w-5 text-gold/50" strokeWidth={1.5} />
              </div>

              <p className="lining-nums tabular-nums mt-7 font-display text-[1.9rem] leading-none tracking-[0.06em] text-night md:text-[2.1rem]">
                {bank.number}
              </p>
              <p className="mt-3 text-xs text-ink-soft">
                {t.gift.accountFor} {bank.holder}
              </p>

              <button
                type="button"
                onClick={() => handleCopy(bank.number, index)}
                className="mt-7 inline-flex w-fit cursor-pointer items-center gap-2 rounded-full border border-gold/60 px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-ink transition-colors hover:bg-gold/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              >
                {copied === index ? (
                  <Check className="h-3.5 w-3.5 text-sage" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                {copied === index ? t.gift.copied : t.gift.copy}
              </button>
            </article>
          </Reveal>
        ))}
      </div>

      {gift.qris ? (
        <Reveal delay={0.15} className="relative z-10 mx-auto mt-10 max-w-md">
          <div className="rounded-[26px] border border-gold/40 bg-cream px-7 py-8 text-center shadow-[0_18px_50px_rgba(13,41,30,0.07)]">
            <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-gold-ink">
              <QrCode className="h-4 w-4" /> {t.gift.qrisTitle}
            </p>
            <img
              src={gift.qris}
              alt={t.gift.qrisTitle}
              className="mx-auto mt-5 w-56 rounded-xl border border-gold/30"
            />
            <p className="mt-4 text-xs leading-relaxed text-ink-soft">
              {t.gift.qrisNote}
            </p>
          </div>
        </Reveal>
      ) : null}
    </section>
  );
}
