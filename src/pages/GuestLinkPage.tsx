import { ArrowLeft, Check, Copy, Download, MessageCircle, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { ToastProvider, useToast } from "@/components/common/Toast";
import { EucalyptusSprig } from "@/components/ornaments/ornaments";
import { weddingConfig } from "@/data/weddingConfig";
import { copyText } from "@/lib/clipboard";

type GuestRow = { name: string; phone: string; link: string };

/**
 * Generator link tamu (halaman untuk mempelai, bukan untuk tamu).
 * Format baris: Nama  — atau —  Nama | 62812xxxxxxx (nomor WA opsional)
 */
export default function GuestLinkPage() {
  return (
    <ToastProvider>
      <GuestLinkInner />
    </ToastProvider>
  );
}

function GuestLinkInner() {
  const toast = useToast();
  const { couple, event } = weddingConfig;

  const [baseUrl, setBaseUrl] = useState(() => `${window.location.origin}/`);
  const [input, setInput] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const rows = useMemo<GuestRow[]>(() => {
    const base = baseUrl.trim() || `${window.location.origin}/`;
    const separator = base.includes("?") ? "&" : "?";
    return input
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [rawName = "", rawPhone = ""] = line.split("|");
        const name = rawName.trim();
        const phone = rawPhone.replace(/[^\d]/g, "");
        return {
          name,
          phone,
          link: `${base}${separator}to=${encodeURIComponent(name)}`,
        };
      })
      .filter((row) => row.name.length > 0);
  }, [input, baseUrl]);

  const waMessage = (row: GuestRow) =>
    `Assalamu'alaikum ${row.name}, tanpa mengurangi rasa hormat, kami mengundang Anda ke pernikahan ${couple.groomName} & ${couple.brideName} (${event.weddingDayLabel}).\n\nUndangan lengkap dapat dibuka di: ${row.link}`;

  const waHref = (row: GuestRow) =>
    row.phone
      ? `https://wa.me/${row.phone}?text=${encodeURIComponent(waMessage(row))}`
      : `https://wa.me/?text=${encodeURIComponent(waMessage(row))}`;

  const handleCopy = async (text: string, index: number) => {
    try {
      await copyText(text);
      setCopiedIndex(index);
      toast("Link tamu disalin");
      window.setTimeout(
        () => setCopiedIndex((current) => (current === index ? null : current)),
        2000,
      );
    } catch {
      toast("Gagal menyalin, silakan salin manual");
    }
  };

  const copyAll = async () => {
    try {
      await copyText(rows.map((row) => `${row.name}: ${row.link}`).join("\n"));
      toast(`${rows.length} link disalin semua`);
    } catch {
      toast("Gagal menyalin, silakan salin manual");
    }
  };

  const downloadCsv = () => {
    const header = "Nama,Link,WhatsApp";
    const lines = rows.map(
      (row) => `"${row.name}","${row.link}","${waHref(row)}"`,
    );
    const blob = new Blob(["\uFEFF" + [header, ...lines].join("\r\n")], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "link-tamu-dimas-intan.csv";
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 4000);
  };

  return (
    <div className="relative min-h-screen bg-pearl pb-24">
      <EucalyptusSprig className="pointer-events-none fixed -left-16 top-24 h-72 w-36 rotate-[22deg] text-sage/15" />
      <EucalyptusSprig className="pointer-events-none fixed -right-16 bottom-24 h-72 w-36 -rotate-[22deg] -scale-x-100 text-sage/15" />

      <header className="fixed inset-x-0 top-0 z-40 border-b border-gold/20 bg-night/95">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-5 py-3.5">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-cream/80 transition-colors hover:text-gold"
          >
            <ArrowLeft className="h-4 w-4" />
            Undangan
          </Link>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gold">
            Buat Link Tamu
          </p>
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-3xl px-5 pt-28">
        <h1 className="font-display text-4xl text-night md:text-5xl">
          Generator Link Tamu
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-soft">
          Tempel daftar nama tamu (satu nama per baris), lalu salin linknya atau
          langsung kirim via WhatsApp. Nama tamu akan muncul otomatis di halaman
          pembuka undangan.
        </p>

        <div className="mt-8 space-y-5 rounded-2xl border border-gold/40 bg-cream px-6 py-7 shadow-[0_18px_50px_rgba(13,41,30,0.08)]">
          <div>
            <label
              htmlFor="base-url"
              className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gold-ink"
            >
              Alamat undangan
            </label>
            <input
              id="base-url"
              value={baseUrl}
              onChange={(event) => setBaseUrl(event.target.value)}
              className="mt-2 w-full rounded-lg border border-night/10 bg-pearl px-4 py-3 text-sm text-night focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
            />
            <p className="mt-1.5 text-[11px] text-ink-soft">
              Ganti dengan alamat akhir undangan Anda (mis. setelah deploy ke
              Vercel atau InfinityFree) agar link yang dibagikan benar.
            </p>
          </div>

          <div>
            <label
              htmlFor="guest-list"
              className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gold-ink"
            >
              Daftar tamu
            </label>
            <textarea
              id="guest-list"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              rows={6}
              placeholder={"Budi Santoso\nAni & Keluarga | 6281234567890\nRekan Kerja Dimas"}
              className="mt-2 w-full resize-y rounded-lg border border-night/10 bg-pearl px-4 py-3 font-mono text-sm text-night placeholder:text-ink-soft/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
            />
            <p className="mt-1.5 text-[11px] leading-relaxed text-ink-soft">
              Opsional: tambahkan nomor WhatsApp setelah tanda{" "}
              <code className="rounded bg-champagne px-1.5 py-0.5 text-[10px]">|</code>{" "}
              agar tombol WA langsung mengarah ke chat tamu tersebut.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={copyAll}
              disabled={rows.length === 0}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-sage px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-cream transition-colors hover:bg-night disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Copy className="h-4 w-4" />
              Salin Semua Link
            </button>
            <button
              type="button"
              onClick={downloadCsv}
              disabled={rows.length === 0}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-gold/60 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-ink transition-colors hover:bg-gold/15 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              Unduh CSV
            </button>
            <span className="inline-flex items-center gap-2 text-[11px] text-ink-soft">
              <Users className="h-3.5 w-3.5" />
              {rows.length} tamu
            </span>
          </div>
        </div>

        {rows.length > 0 && (
          <ul className="mt-8 space-y-3">
            {rows.map((row, index) => (
              <li
                key={`${row.name}-${index}`}
                className="flex flex-col gap-3 rounded-xl border border-night/10 bg-cream px-4 py-3.5 sm:flex-row sm:items-center"
              >
                <span className="w-8 shrink-0 font-display text-lg text-gold-deep">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-night">
                    {row.name}
                    {row.phone ? (
                      <span className="ml-2 text-[10px] font-normal text-ink-soft">
                        +{row.phone}
                      </span>
                    ) : null}
                  </p>
                  <p className="truncate text-[11px] text-ink-soft">{row.link}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(row.link, index)}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-gold/60 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-gold-ink transition-colors hover:bg-gold/15"
                  >
                    {copiedIndex === index ? (
                      <Check className="h-3.5 w-3.5 text-sage" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    Salin
                  </button>
                  <a
                    href={waHref(row)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-sage/50 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-sage transition-colors hover:bg-sage/10"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    WA
                  </a>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
