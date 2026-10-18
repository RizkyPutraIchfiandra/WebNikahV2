import { Check, Heart, Link2, MessageCircle } from "lucide-react";
import { useState } from "react";

import { Reveal } from "@/components/common/Reveal";
import { useToast } from "@/components/common/Toast";
import { FallingLeaves } from "@/components/ornaments/FallingLeaves";
import { LeafDivider } from "@/components/ornaments/ornaments";
import { weddingConfig } from "@/data/weddingConfig";
import { copyText } from "@/lib/clipboard";
import { useLanguage } from "@/lib/i18n";

/** Penutup — bookend foto sinematik (sama dengan pembuka), terima kasih & bagikan. */
export function Closing() {
  const { t } = useLanguage();
  const toast = useToast();
  const { couple, event, media } = weddingConfig;
  const [copied, setCopied] = useState(false);

  const shareUrl =
    typeof window !== "undefined"
      ? window.location.origin + window.location.pathname
      : "";
  const shareMessage = `Undangan pernikahan ${couple.groomName} & ${couple.brideName} — ${event.weddingDayLabel}.\n${shareUrl}`;
  const waHref = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`;

  const onCopy = async () => {
    try {
      await copyText(shareUrl);
      setCopied(true);
      toast(t.share.copied);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      toast(t.gift.copyError);
    }
  };

  return (
    <section className="grain grain-dark relative overflow-hidden bg-night">
      <img
        src={media.openingImage}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover opacity-40"
        style={{ objectPosition: "50% 30%" }}
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-night via-night/60 to-night"
        aria-hidden="true"
      />

      <FallingLeaves tone="dark" count={8} />

      <Reveal className="relative z-10 mx-auto flex max-w-2xl flex-col items-center px-6 pb-28 pt-24 text-center md:pb-36 md:pt-32">
        <h2 className="font-display text-4xl text-cream md:text-5xl">
          {t.closing.title}
        </h2>
        <LeafDivider className="mt-6 h-5 w-44 text-gold/75" />

        <p className="mt-7 max-w-xl text-sm leading-relaxed text-sage-light md:text-base">
          {t.closing.text}
        </p>

        <p className="mt-12 text-[11px] uppercase tracking-[0.4em] text-gold">
          {t.closing.happy}
        </p>
        <p className="text-gold-foil mt-4 font-display text-5xl leading-tight md:text-6xl">
          {couple.groomName} &amp; {couple.brideName}
        </p>
        <p className="mt-3 text-xs uppercase tracking-[0.3em] text-sage-soft">
          {event.weddingDateLabel}
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3.5">
          <a
            href={waHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2.5 rounded-full bg-gold px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-night transition-transform duration-300 hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
          >
            <MessageCircle className="h-4 w-4" />
            {t.share.button}
          </a>
          <button
            type="button"
            onClick={onCopy}
            className="inline-flex cursor-pointer items-center gap-2.5 rounded-full border border-gold/50 px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold transition-colors hover:bg-gold/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
          >
            {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
            {copied ? t.gift.copied : t.share.copyLink}
          </button>
        </div>

        <p className="mt-14 flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-sage-soft">
          <Heart className="h-3 w-3 text-gold/70" />
          {couple.groomName} &amp; {couple.brideName} · 2026
        </p>
      </Reveal>
    </section>
  );
}
