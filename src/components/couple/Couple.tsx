import { Reveal } from "@/components/common/Reveal";
import { SectionTitle } from "@/components/common/SectionTitle";
import { weddingConfig } from "@/data/weddingConfig";
import { useLanguage } from "@/lib/i18n";

/** Mempelai — baris editorial berselang-seling: potret lengkung + nama & orang tua. */
export function Couple() {
  const { t } = useLanguage();
  const { couple } = weddingConfig;

  const people = [
    {
      photo: couple.bridePhoto,
      nickname: couple.brideNickname,
      fullName: couple.brideFullName,
      role: t.couple.brideRole,
      parents: t.couple.brideParents,
    },
    {
      photo: couple.groomPhoto,
      nickname: couple.groomNickname,
      fullName: couple.groomFullName,
      role: t.couple.groomRole,
      parents: t.couple.groomParents,
    },
  ];

  return (
    <section id="couple" className="grain relative bg-pearl px-6 py-24 md:py-32 scroll-mt-16">
      <SectionTitle
        index="02"
        eyebrow={t.couple.eyebrow}
        title={t.couple.title}
        subtitle={t.couple.subtitle}
      />

      <div className="relative z-10 mx-auto mt-16 max-w-5xl space-y-20 md:space-y-24">
        {people.map((person, index) => {
          const reversed = index === 1;
          return (
            <Reveal key={person.fullName} delay={index * 0.08}>
              <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
                <div
                  className={`relative mx-auto w-64 md:mx-0 md:w-full md:max-w-[19rem] ${
                    reversed ? "md:order-2 md:justify-self-end" : "md:justify-self-start"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="arch pointer-events-none absolute -inset-3 border border-gold/30"
                  />
                  <div className="arch relative overflow-hidden border border-gold/50 bg-champagne p-2">
                    <img
                      src={person.photo}
                      alt={person.fullName}
                      loading="lazy"
                      decoding="async"
                      className="arch aspect-[3/4] w-full object-cover"
                    />
                  </div>
                </div>

                <div
                  className={`flex flex-col items-center text-center ${
                    reversed
                      ? "md:order-1 md:items-end md:text-right"
                      : "md:items-start md:text-left"
                  }`}
                >
                  <p className="text-[11px] uppercase tracking-[0.42em] text-gold-ink">
                    {person.role}
                  </p>
                  <h3 className="mt-4 font-display text-5xl leading-none text-night md:text-6xl">
                    {person.nickname}
                  </h3>
                  <p className="mt-3 text-[11px] uppercase tracking-[0.3em] text-ink-soft">
                    {person.fullName}
                  </p>
                  <p className="mt-6 max-w-xs text-sm leading-relaxed text-ink-soft">
                    {person.parents}
                  </p>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
