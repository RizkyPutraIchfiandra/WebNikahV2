import { Languages } from "lucide-react";

import { useLanguage } from "@/lib/i18n";

/** Tombol ganti bahasa (EN ⇄ ID) — tampil sama di navigasi & layar pembuka. */
export function LanguageToggle({ className = "" }: { className?: string }) {
  const { t, language, toggleLanguage } = useLanguage();

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      title={t.language.button}
      aria-label={t.language.aria}
      className={`inline-flex cursor-pointer items-center gap-2 rounded-full border border-gold/30 bg-night/85 px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-cream backdrop-blur-sm transition-colors hover:border-gold hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${className}`}
    >
      <Languages className="h-3.5 w-3.5" />
      {language === "id" ? "EN" : "ID"}
    </button>
  );
}
