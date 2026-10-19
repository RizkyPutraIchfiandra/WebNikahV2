import { Reveal } from "@/components/common/Reveal";
import { SectionTitle } from "@/components/common/SectionTitle";
import {
  ArchCrown,
  CornerSpray,
  EucalyptusSprig,
} from "@/components/ornaments/ornaments";
import { weddingConfig } from "@/data/weddingConfig";
import { useLanguage } from "@/lib/i18n";

type Person = {
  photo: string;
  nickname: string;
  fullName: string;
  role: string;
  parents: string;
};

/** Baris mempelai — potret lengkung + rangkaian garis editorial & plakat orang tua. */
function PersonRow({
  person,
  reversed = false,
}: {
  person: Person;
  reversed?: boolean;
}) {
  return (
    <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
      {/* ————— Potret ————— */}
      <div
        className={`relative mx-auto w-64 md:mx-0 md:w-full md:max-w-[21rem] ${
          reversed ? "md:order-2 md:justify-self-end" : "md:justify-self-start"
        }`}
      >
        {/* mahkota botani di puncak lengkungan + tanda editorial di bawah foto */}
        <ArchCrown className="pointer-events-none absolute -top-9 left-1/2 h-8 w-[4.5rem] -translate-x-1/2 text-gold-ink/75" />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-7 left-1/2 flex -translate-x-1/2 flex-col items-center"
        >
          <span className="h-[18px] w-px bg-gradient-to-t from-gold/60 to-gold/30" />
          <span className="mt-1 h-[7px] w-[7px] rotate-45 border border-gold/70 bg-pearl" />
        </span>

        {/* ranting eucalyptus di sisi bawah foto */}
        <EucalyptusSprig
          className={`pointer-events-none absolute -bottom-8 h-44 w-24 text-sage/35 ${
            reversed ? "-right-6 rotate-12 scale-x-[-1]" : "-left-6 -rotate-12"
          }`}
        />

        {/* bingkai lengkung ganda */}
        <span
          aria-hidden="true"
          className="arch pointer-events-none absolute -inset-3 border border-gold/30"
        />
        <span
          aria-hidden="true"
          className="arch pointer-events-none absolute -inset-[18px] hidden border border-gold/15 md:block"
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

      {/* ————— Teks ————— */}
      <div
        className={`relative flex flex-col items-center text-center ${
          reversed
            ? "md:order-1 md:items-end md:text-right"
            : "md:items-start md:text-left"
        }`}
      >
        {/* garis tepi luar */}
        <span
          aria-hidden="true"
          className={`absolute top-1/2 hidden h-52 w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-gold/30 to-transparent md:block ${
            reversed ? "left-0" : "right-0"
          }`}
        />

        {/* peran mempelai */}
        <p className="text-[10px] uppercase tracking-[0.42em] text-gold-ink">
          {person.role}
        </p>

        <h3 className="mt-5 font-display text-5xl leading-none text-night md:text-6xl">
          {person.nickname}
        </h3>

        {/* pembatas garis + berlian */}
        <div aria-hidden="true" className="mt-5 flex items-center gap-3">
          <span className="h-px w-10 bg-gold/50" />
          <span className="h-[5px] w-[5px] rotate-45 bg-gold/70" />
          <span className="h-px w-10 bg-gold/50" />
        </div>

        <p className="mt-4 text-[11px] uppercase tracking-[0.3em] text-ink-soft">
          {person.fullName}
        </p>

        {/* plakat orang tua — bingkai dobel */}
        <div className="relative mt-7 w-full max-w-sm">
          <span
            aria-hidden="true"
            className="absolute -inset-1.5 border border-gold/15"
          />
          <div className="relative border border-gold/35 bg-champagne/55 px-6 py-5">
            <span
              aria-hidden="true"
              className="absolute -top-[5px] left-1/2 h-[9px] w-[9px] -translate-x-1/2 rotate-45 border border-gold/60 bg-champagne"
            />
            <p
              className={`text-center text-sm leading-relaxed text-ink-soft ${
                reversed ? "md:text-right" : "md:text-left"
              }`}
            >
              {person.parents}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Pembatas antar mempelai — garis, berlian, dan ampersand. */
function CoupleDivider() {
  return (
    <div
      aria-hidden="true"
      className="flex items-center justify-center gap-4 md:gap-6"
    >
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-gold/50 md:w-28" />
      <span className="h-[5px] w-[5px] rotate-45 bg-gold/60" />
      <span className="text-gold-foil bg-pearl px-1 font-display text-3xl italic leading-none md:text-4xl">
        &amp;
      </span>
      <span className="h-[5px] w-[5px] rotate-45 bg-gold/60" />
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-gold/50 md:w-28" />
    </div>
  );
}

/** Mempelai — dua panel potret dengan garis poros editorial di tengah. */
export function Couple() {
  const { t } = useLanguage();
  const { couple } = weddingConfig;

  const people: Person[] = [
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
    <section
      id="couple"
      className="grain relative scroll-mt-16 overflow-hidden bg-pearl px-6 py-24 md:py-32"
    >
      {/* sebaran botani di sudut section — mengisi ruang kosong */}
      <CornerSpray className="pointer-events-none absolute right-0 top-2 hidden h-64 w-64 scale-x-[-1] text-sage/20 md:block" />
      <CornerSpray className="pointer-events-none absolute bottom-2 left-0 hidden h-64 w-64 scale-y-[-1] text-sage/20 md:block" />

      <SectionTitle
        index="02"
        eyebrow={t.couple.eyebrow}
        title={t.couple.title}
        subtitle={t.couple.subtitle}
      />

      <div className="relative z-10 mx-auto mt-14 max-w-5xl md:mt-16">
        {/* garis poros tengah */}
        <span
          aria-hidden="true"
          className="absolute bottom-6 left-1/2 top-6 hidden w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-gold/25 to-transparent md:block"
        />

        <div className="space-y-14 md:space-y-16">
          <Reveal>
            <PersonRow person={people[0]} />
          </Reveal>

          <Reveal delay={0.05}>
            <CoupleDivider />
          </Reveal>

          <Reveal delay={0.08}>
            <PersonRow person={people[1]} reversed />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
