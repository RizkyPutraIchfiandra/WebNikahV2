import { Check, ChevronDown, Info, Loader2, MessageCircle, Send, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState, type CSSProperties, type FormEvent } from "react";

import { Reveal } from "@/components/common/Reveal";
import { SectionTitle } from "@/components/common/SectionTitle";
import { useToast } from "@/components/common/Toast";
import { LeafIcon } from "@/components/ornaments/ornaments";
import {
  formatWishTime,
  guestbookMode,
  guestbookStore,
  type Attendance,
  type WishEntry,
} from "@/lib/guestbook";
import { useLanguage } from "@/lib/i18n";

/** RSVP + buku tamu — form konfirmasi kehadiran & daftar ucapan. */
export function RSVP({ guestName }: { guestName: string }) {
  const { t, language } = useLanguage();
  const toast = useToast();

  const [wishes, setWishes] = useState<WishEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);

  const [name, setName] = useState("");
  const [attendance, setAttendance] = useState<Attendance>("hadir");
  const [guests, setGuests] = useState(1);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setWishes(await guestbookStore.list());
    } catch {
      toast(t.rsvp.error);
    } finally {
      setLoading(false);
    }
  }, [toast, t.rsvp.error]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (guestName) setName((current) => current || guestName);
  }, [guestName]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = name.trim();
    const trimmedMessage = message.trim();

    if (trimmedName.length < 2 || trimmedMessage.length < 3) {
      toast(t.rsvp.required);
      return;
    }

    setSending(true);
    try {
      const created = await guestbookStore.add({
        name: trimmedName.slice(0, 80),
        attendance,
        guests: attendance === "hadir" ? guests : 0,
        message: trimmedMessage.slice(0, 500),
      });
      setWishes((current) => [created, ...current]);
      setMessage("");
      setSent(true);
      toast(t.rsvp.success);
    } catch {
      toast(t.rsvp.error);
    } finally {
      setSending(false);
    }
  };

  const visibleWishes = useMemo(
    () => wishes.slice(0, visibleCount),
    [wishes, visibleCount],
  );

  return (
    <section id="rsvp" className="grain relative scroll-mt-16 bg-pearl px-6 py-24 md:py-32">
      <SectionTitle
        index="07"
        eyebrow={t.rsvp.eyebrow}
        title={t.rsvp.title}
        subtitle={t.rsvp.subtitle}
      />

      <div className="relative z-10 mx-auto mt-14 grid max-w-5xl items-start gap-8 lg:grid-cols-[1.05fr_1fr]">
        {/* ————— Form ————— */}
        <Reveal>
          {sent ? (
            <div className="relative flex h-full min-h-[24rem] flex-col items-center justify-center overflow-hidden rounded-2xl border border-gold/40 bg-cream px-8 py-12 text-center shadow-[0_18px_50px_rgba(13,41,30,0.08)]">
              <LeafBurst />
              <span className="relative grid h-16 w-16 place-items-center rounded-full bg-sage/15">
                <Check className="h-7 w-7 text-sage" />
              </span>
              <p className="relative mt-6 max-w-xs font-display text-2xl leading-snug text-night">
                {t.rsvp.success}
              </p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="relative mt-7 inline-flex cursor-pointer items-center gap-2 rounded-full border border-gold/60 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-ink transition-colors hover:bg-gold/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              >
                <Send className="h-3.5 w-3.5" />
                {t.rsvp.again}
              </button>
            </div>
          ) : (
            <form
              onSubmit={submit}
              className="h-full rounded-2xl border border-gold/40 bg-cream px-7 py-8 shadow-[0_18px_50px_rgba(13,41,30,0.08)]"
            >
              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="rsvp-name"
                    className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gold-ink"
                  >
                    {t.rsvp.name}
                  </label>
                  <input
                    id="rsvp-name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder={t.rsvp.namePlaceholder}
                    maxLength={80}
                    className="mt-2 w-full rounded-lg border border-night/10 bg-pearl px-4 py-3 text-sm text-night placeholder:text-ink-soft/60 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
                  />
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gold-ink">
                    {t.rsvp.attendance}
                  </p>
                  <div className="mt-2 grid grid-cols-2 gap-2.5">
                    {(["hadir", "tidak-hadir"] as Attendance[]).map((value) => {
                      const active = attendance === value;
                      return (
                        <button
                          key={value}
                          type="button"
                          aria-pressed={active}
                          onClick={() => setAttendance(value)}
                          className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg border px-3 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors ${
                            active
                              ? "border-gold bg-gold/15 text-night"
                              : "border-night/10 bg-pearl text-ink-soft hover:border-gold/40"
                          }`}
                        >
                          {value === "hadir" ? (
                            <Check className="h-3.5 w-3.5" />
                          ) : (
                            <X className="h-3.5 w-3.5" />
                          )}
                          {value === "hadir" ? t.rsvp.attending : t.rsvp.notAttending}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {attendance === "hadir" && (
                  <div>
                    <label
                      htmlFor="rsvp-guests"
                      className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gold-ink"
                    >
                      {t.rsvp.guests}
                    </label>
                    <div className="relative mt-2">
                      <select
                        id="rsvp-guests"
                        value={guests}
                        onChange={(event) => setGuests(Number(event.target.value))}
                        className="w-full cursor-pointer appearance-none rounded-lg border border-night/10 bg-pearl px-4 py-3 pr-10 text-sm text-night focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
                      >
                        {[1, 2, 3, 4, 5].map((count) => (
                          <option key={count} value={count}>
                            {count} {t.rsvp.person}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
                    </div>
                  </div>
                )}

                <div>
                  <label
                    htmlFor="rsvp-message"
                    className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gold-ink"
                  >
                    {t.rsvp.wishes}
                  </label>
                  <textarea
                    id="rsvp-message"
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    rows={4}
                    maxLength={500}
                    placeholder={t.rsvp.wishesPlaceholder}
                    className="mt-2 w-full resize-none rounded-lg border border-night/10 bg-pearl px-4 py-3 text-sm text-night placeholder:text-ink-soft/60 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
                  />
                  <p className="mt-1 text-right text-[10px] text-ink-soft">
                    {message.length}/500
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="inline-flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-full bg-sage px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-cream transition-colors duration-300 hover:bg-night focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold disabled:cursor-wait disabled:opacity-70"
                >
                  {sending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  {sending ? t.rsvp.sending : t.rsvp.send}
                </button>

                {guestbookMode === "local" && (
                  <p className="flex items-start gap-2 text-[11px] leading-relaxed text-ink-soft">
                    <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    {t.rsvp.localMode}
                  </p>
                )}
              </div>
            </form>
          )}
        </Reveal>

        {/* ————— Daftar ucapan ————— */}
        <Reveal delay={0.1}>
          <div className="flex h-full flex-col rounded-2xl border border-gold/30 bg-cream px-6 py-7 shadow-[0_18px_50px_rgba(13,41,30,0.08)]">
            <div className="flex items-center justify-between gap-3">
              <h3 className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-gold-ink">
                <MessageCircle className="h-4 w-4" />
                {t.rsvp.wishes}
              </h3>
              <span className="rounded-full bg-champagne px-3 py-1 text-[10px] font-semibold text-gold-ink">
                {wishes.length} {t.rsvp.wishCount}
              </span>
            </div>

            <div className="custom-scroll mt-5 max-h-[28rem] flex-1 space-y-3.5 overflow-y-auto pr-1.5">
              {loading ? (
                [0, 1, 2].map((index) => (
                  <div
                    key={index}
                    className="animate-pulse rounded-xl border border-night/5 bg-pearl/80 px-4 py-4"
                  >
                    <div className="h-3 w-28 rounded-full bg-night/10" />
                    <div className="mt-3 h-3 w-full rounded-full bg-night/10" />
                    <div className="mt-2 h-3 w-3/5 rounded-full bg-night/10" />
                  </div>
                ))
              ) : visibleWishes.length === 0 ? (
                <div className="flex h-full min-h-[12rem] flex-col items-center justify-center gap-3 text-center">
                  <MessageCircle className="h-7 w-7 text-gold/60" />
                  <p className="max-w-[16rem] text-sm text-ink-soft">{t.rsvp.empty}</p>
                </div>
              ) : (
                visibleWishes.map((wish) => (
                  <article
                    key={wish.id}
                    className="rounded-xl border border-night/5 bg-pearl/80 px-4 py-3.5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-sage/15 font-display text-sm text-sage">
                          {wish.name.charAt(0).toUpperCase()}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-night">
                            {wish.name}
                          </p>
                          <p className="text-[10px] text-ink-soft">
                            {formatWishTime(wish.createdAt, language)}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider ${
                          wish.attendance === "hadir"
                            ? "bg-sage/15 text-sage"
                            : "bg-gold/20 text-gold-ink"
                        }`}
                      >
                        {wish.attendance === "hadir"
                          ? wish.guests > 0
                            ? `${t.rsvp.attending} · ${wish.guests} ${t.rsvp.person}`
                            : t.rsvp.attending
                          : t.rsvp.notAttending}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                      {wish.message}
                    </p>
                  </article>
                ))
              )}
            </div>

            {visibleCount < wishes.length && (
              <button
                type="button"
                onClick={() => setVisibleCount((current) => current + 6)}
                className="mx-auto mt-5 inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-gold/50 px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-ink transition-colors hover:bg-gold/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              >
                {t.rsvp.loadMore}
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ————— Ledakan daun kecil saat ucapan terkirim ————— */
function LeafBurst() {
  const items = useMemo(
    () =>
      Array.from({ length: 10 }, (_, index) => {
        const angle = (index / 10) * Math.PI * 2;
        const distance = 72 + (index % 3) * 34;
        return {
          bx: Math.cos(angle) * distance,
          by: Math.sin(angle) * distance - 26,
          br: (index % 2 ? 1 : -1) * (80 + index * 12),
          delay: (index % 4) * 60,
          variant: (index % 3) as 0 | 1 | 2,
        };
      }),
    [],
  );

  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-visible"
    >
      {items.map((item, index) => (
        <span
          key={index}
          className="leaf-burst absolute left-1/2 top-1/2"
          style={
            {
              "--bx": `${item.bx}px`,
              "--by": `${item.by}px`,
              "--br": `${item.br}deg`,
              animationDelay: `${item.delay}ms`,
            } as CSSProperties
          }
        >
          <LeafIcon
            variant={item.variant}
            style={{
              width: 14,
              height: "auto",
              color: index % 2 ? "#d4af37" : "#6e8a7b",
            }}
          />
        </span>
      ))}
    </span>
  );
}
