import {
  ArrowLeft,
  Check,
  Copy,
  Download,
  FileSpreadsheet,
  MessageCircle,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { WorkBook } from "xlsx";

import { ToastProvider, useToast } from "@/components/common/Toast";
import { EucalyptusSprig } from "@/components/ornaments/ornaments";
import { weddingConfig } from "@/data/weddingConfig";
import { copyText } from "@/lib/clipboard";

type GuestRow = { name: string; phone: string; link: string };

/** File tamu (Excel/CSV) yang sudah dibaca — disimpan di ref untuk diproses. */
type ImportedFile = {
  fileName: string;
  isCsv: boolean;
  workbook: WorkBook;
  sheetName: string;
  nameIdx: number;
  linkIdx: number;
  linkCreated: boolean;
};

/** Ringkasan hasil pembacaan file, ditampilkan di UI. */
type ImportInfo = {
  fileName: string;
  count: number;
  nameHeader: string;
  linkHeader: string;
  linkCreated: boolean;
  names: string[];
};

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

  const [baseUrl, setBaseUrl] = useState(
    () =>
      window.localStorage.getItem("wedding-guest-base-url") ??
      `${window.location.origin}/`,
  );
  const [input, setInput] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [importInfo, setImportInfo] = useState<ImportInfo | null>(null);
  const importedRef = useRef<ImportedFile | null>(null);

  useEffect(() => {
    window.localStorage.setItem("wedding-guest-base-url", baseUrl);
  }, [baseUrl]);

  const buildLink = (name: string) => {
    const base = baseUrl.trim() || `${window.location.origin}/`;
    const separator = base.includes("?") ? "&" : "?";
    return `${base}${separator}to=${encodeURIComponent(name.trim())}`;
  };

  const rows = useMemo<GuestRow[]>(
    () =>
      input
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const [rawName = "", rawPhone = ""] = line.split("|");
          const name = rawName.trim();
          const phone = rawPhone.replace(/[^\d]/g, "");
          return { name, phone, link: buildLink(name) };
        })
        .filter((row) => row.name.length > 0),
    [input, baseUrl],
  );

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

  const handleFile = async (file: File) => {
    try {
      const XLSX = await import("xlsx");
      const isCsv = /\.csv$/i.test(file.name);
      const workbook = isCsv
        ? XLSX.read(await file.text(), { type: "string" })
        : XLSX.read(await file.arrayBuffer(), { type: "array" });
      const sheetName = workbook.SheetNames[0];
      if (!sheetName) {
        toast("File tidak memiliki lembar kerja yang bisa dibaca");
        return;
      }

      const sheet = workbook.Sheets[sheetName];
      const table = XLSX.utils.sheet_to_json<(string | number)[]>(sheet, {
        header: 1,
        defval: "",
      });
      const header = (table[0] ?? []).map((cell) => String(cell ?? "").trim());
      const normalized = header.map((cell) => cell.toLowerCase());

      let nameIdx = normalized.findIndex((cell) => cell === "nama");
      if (nameIdx === -1)
        nameIdx = normalized.findIndex((cell) => cell.includes("nama"));
      if (nameIdx === -1) {
        toast('Kolom "Nama" tidak ditemukan — pastikan file memiliki kolom nama tamu');
        return;
      }

      let linkIdx = normalized.findIndex((cell) => cell.includes("link"));
      const linkCreated = linkIdx === -1;
      if (linkCreated) linkIdx = Math.max(header.length, 1);

      const names = table
        .slice(1)
        .map((row) => String(row?.[nameIdx] ?? "").trim())
        .filter(Boolean);
      if (names.length === 0) {
        toast("Tidak ada nama tamu yang terbaca di file");
        return;
      }

      importedRef.current = {
        fileName: file.name,
        isCsv,
        workbook,
        sheetName,
        nameIdx,
        linkIdx,
        linkCreated,
      };
      setImportInfo({
        fileName: file.name,
        count: names.length,
        nameHeader: header[nameIdx] || `Kolom ${nameIdx + 1}`,
        linkHeader: linkCreated
          ? "Link Undangan (kolom baru)"
          : header[linkIdx] || `Kolom ${linkIdx + 1}`,
        linkCreated,
        names,
      });
      toast(`${names.length} nama tamu terbaca dari ${file.name}`);
    } catch {
      toast("File tidak bisa dibaca — gunakan format .xlsx, .xls, atau .csv");
    }
  };

  const processImport = async () => {
    const imported = importedRef.current;
    if (!imported) return;

    try {
      const XLSX = await import("xlsx");
      const {
        workbook,
        sheetName,
        nameIdx,
        linkIdx,
        isCsv,
        fileName,
        linkCreated,
      } = imported;
      const sheet = workbook.Sheets[sheetName];
      const table = XLSX.utils.sheet_to_json<(string | number)[]>(sheet, {
        header: 1,
        defval: "",
      });

      // Isi kolom "Link Undangan" untuk setiap baris yang punya nama.
      let filled = 0;
      for (let rowIndex = 1; rowIndex < table.length; rowIndex += 1) {
        const name = String(table[rowIndex]?.[nameIdx] ?? "").trim();
        if (!name) continue;
        sheet[XLSX.utils.encode_cell({ r: rowIndex, c: linkIdx })] = {
          t: "s",
          v: buildLink(name),
        };
        filled += 1;
      }

      // Rapikan area sheet: sertakan kolom link (dan header bila kolomnya baru).
      const range = XLSX.utils.decode_range(sheet["!ref"] ?? "A1");
      if (linkCreated) {
        sheet[XLSX.utils.encode_cell({ r: 0, c: linkIdx })] = {
          t: "s",
          v: "Link Undangan",
        };
        const cols = (sheet["!cols"] ?? []).slice();
        while (cols.length < linkIdx) cols.push({ wch: 12 });
        cols[linkIdx] = { wch: 48 };
        sheet["!cols"] = cols;
      }
      range.e.r = Math.max(range.e.r, table.length - 1);
      range.e.c = Math.max(range.e.c, linkIdx);
      sheet["!ref"] = XLSX.utils.encode_range(range);

      const outBase = fileName.replace(/\.(xlsx|xls|csv)$/i, "");
      if (isCsv) {
        const csv = XLSX.utils.sheet_to_csv(sheet);
        const blob = new Blob(["\uFEFF" + csv], {
          type: "text/csv;charset=utf-8",
        });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = `${outBase} (link terisi).csv`;
        anchor.click();
        window.setTimeout(() => URL.revokeObjectURL(url), 4000);
      } else {
        XLSX.writeFile(workbook, `${outBase} (link terisi).xlsx`);
      }
      toast(`${filled} link undangan terisi — file sedang diunduh`);
    } catch {
      toast("Gagal memproses file, coba lagi");
    }
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

        <div className="mt-8 space-y-5 rounded-2xl border border-gold/40 bg-cream px-6 py-7 shadow-[0_18px_50px_rgba(13,41,30,0.08)]">
          <div>
            <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-gold-ink">
              <FileSpreadsheet className="h-4 w-4" />
              Impor dari File (Excel / CSV)
            </p>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-soft">
              Unggah file daftar tamu yang punya kolom <strong>Nama</strong> dan{" "}
              <strong>Link undangan</strong> — kolom Link Undangan akan diisi
              otomatis untuk semua tamu, lalu file hasilnya langsung terunduh.
              Link dibuat dari “Alamat undangan” di atas.
            </p>
          </div>

          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void handleFile(file);
              event.target.value = "";
            }}
            className="block w-full cursor-pointer rounded-lg border border-night/10 bg-pearl px-4 py-2.5 text-sm text-night transition-colors file:mr-4 file:cursor-pointer file:rounded-full file:border-0 file:bg-sage file:px-5 file:py-2.5 file:text-[11px] file:font-semibold file:uppercase file:tracking-[0.16em] file:text-cream hover:file:bg-night focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
          />

          {importInfo ? (
            <div className="space-y-4">
              <p className="text-xs leading-relaxed text-ink-soft">
                Dari <strong className="text-night">{importInfo.fileName}</strong>{" "}
                — terbaca{" "}
                <strong className="text-night">{importInfo.count} tamu</strong> ·
                kolom nama: “{importInfo.nameHeader}” · kolom link: “
                {importInfo.linkHeader}”
              </p>
              <ul className="space-y-1.5 rounded-lg border border-night/10 bg-pearl px-4 py-3">
                {importInfo.names.slice(0, 3).map((name, index) => (
                  <li
                    key={`${name}-${index}`}
                    className="truncate text-[11px] text-ink-soft"
                  >
                    <span className="font-semibold text-night">{name}</span> →{" "}
                    {buildLink(name)}
                  </li>
                ))}
                {importInfo.count > 3 ? (
                  <li className="text-[11px] text-ink-soft">
                    …dan {importInfo.count - 3} tamu lainnya
                  </li>
                ) : null}
              </ul>
              <button
                type="button"
                onClick={() => void processImport()}
                className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-gold px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-night transition-transform duration-300 hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
              >
                <Download className="h-4 w-4" />
                Isi Link &amp; Unduh File
              </button>
            </div>
          ) : (
            <p className="text-[11px] leading-relaxed text-ink-soft">
              Kalau kolom “Link Undangan” sudah berisi link lama, isinya akan
              ditimpa dengan format link aplikasi ini (nama tamu tetap tampil
              persis di halaman pembuka).
            </p>
          )}
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
