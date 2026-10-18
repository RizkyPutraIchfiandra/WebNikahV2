import { SectionOrnament } from "@/components/ornaments/ornaments";

import { Reveal } from "./Reveal";

export function SectionTitle({
  eyebrow,
  title,
  subtitle,
  tone = "light",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";

  return (
    <div className="mx-auto max-w-2xl text-center">
      <Reveal>
        {eyebrow ? (
          <p
            className={`text-[11px] font-medium uppercase tracking-[0.42em] ${
              dark ? "text-gold" : "text-gold-ink"
            }`}
          >
            {eyebrow}
          </p>
        ) : null}
        <SectionOrnament
          className={`mx-auto mt-4 h-4 w-32 ${dark ? "text-gold" : "text-gold-deep"}`}
        />
        <h2
          className={`mt-3 font-display text-4xl leading-tight md:text-5xl ${
            dark ? "text-cream" : "text-night"
          }`}
        >
          {title}
        </h2>
        {subtitle ? (
          <p
            className={`mx-auto mt-4 max-w-xl text-sm leading-relaxed ${
              dark ? "text-sage-light" : "text-ink-soft"
            }`}
          >
            {subtitle}
          </p>
        ) : null}
      </Reveal>
    </div>
  );
}
