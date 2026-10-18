import { Reveal } from "./Reveal";

/**
 * Judul section gaya editorial: nomor bab + garis emas + eyebrow, rata kiri.
 * `index` dipakai untuk penomoran bab (01, 02, …) mengikuti alur undangan.
 */
export function SectionTitle({
  index,
  eyebrow,
  title,
  subtitle,
  tone = "light",
}: {
  index?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";

  return (
    <div className="relative z-10 mx-auto max-w-5xl">
      <Reveal>
        <div className="flex items-center gap-4">
          {index ? (
            <span
              className={`font-display text-sm italic ${
                dark ? "text-gold/80" : "text-gold-ink/80"
              }`}
            >
              {index}
            </span>
          ) : null}
          <span
            aria-hidden="true"
            className={`h-px w-10 ${dark ? "bg-gold/40" : "bg-gold/45"}`}
          />
          {eyebrow ? (
            <p
              className={`text-[11px] font-medium uppercase tracking-[0.42em] ${
                dark ? "text-gold" : "text-gold-ink"
              }`}
            >
              {eyebrow}
            </p>
          ) : null}
        </div>

        <h2
          className={`mt-4 font-display text-4xl leading-tight md:text-[3.1rem] ${
            dark ? "text-cream" : "text-night"
          }`}
        >
          {title}
        </h2>

        {subtitle ? (
          <p
            className={`mt-5 max-w-xl text-sm leading-relaxed ${
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
