import { Reveal } from "@/components/common/Reveal";
import { SectionTitle } from "@/components/common/SectionTitle";
import { ArchCrown } from "@/components/ornaments/ornaments";
import { weddingConfig } from "@/data/weddingConfig";
import { useLanguage } from "@/lib/i18n";

/** Mempelai — dua potret berbingkai lengkung (arch) dengan mahkota botani. */
export function Couple() {
  const { t } = useLanguage();
  const { couple } = weddingConfig;

  const people = [
    {
      photo: couple.bridePhoto,
      name: couple.brideName,
      fullName: couple.brideFullName,
      parents: t.couple.brideParents,
    },
    {
      photo: couple.groomPhoto,
      name: couple.groomName,
      fullName: couple.groomFullName,
      parents: t.couple.groomParents,
    },
  ];

  return (
    <section id="couple" className="grain relative bg-pearl px-6 py-24 md:py-32 scroll-mt-16">
      <SectionTitle
        eyebrow={t.couple.eyebrow}
        title={t.couple.title}
        subtitle={t.couple.subtitle}
      />

      <div className="relative z-10 mx-auto mt-16 grid max-w-4xl gap-16 md:grid-cols-2 md:gap-12">
        {people.map((person, index) => (
          <Reveal
            key={person.name}
            delay={index * 0.12}
            className="flex flex-col items-center text-center"
          >
            <div className="relative w-56 md:w-64">
              <span className="arch pointer-events-none absolute -inset-3 border border-gold/30" />
              <div className="arch relative overflow-hidden border border-gold/50 bg-champagne p-2">
                <img
                  src={person.photo}
                  alt={person.fullName}
                  loading="lazy"
                  decoding="async"
                  className="arch aspect-[3/4] w-full object-cover"
                />
              </div>
              <ArchCrown className="absolute -top-5 left-1/2 h-8 w-16 -translate-x-1/2 text-gold-deep" />
            </div>

            <h3 className="mt-8 font-display text-4xl text-night">{person.name}</h3>
            <p className="mt-1.5 text-[11px] uppercase tracking-[0.3em] text-gold-ink">
              {person.fullName}
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-soft">
              {person.parents}
            </p>
          </Reveal>
        ))}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:block"
        >
          <span className="text-gold-foil font-display text-7xl italic">&amp;</span>
        </div>
      </div>
    </section>
  );
}
