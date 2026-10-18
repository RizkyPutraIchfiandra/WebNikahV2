/**
 * Utilitas link tamu.
 * Format pendek: undangan.com/suparmini  →  layar pembuka menyapa "Suparmini".
 * Format lama (?to=Nama) tetap didukung demi kompatibilitas link yang sudah beredar.
 */

/** Ubah nama tamu menjadi slug URL: "Bu Ati" → "bu-ati". */
export function slugifyGuestName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['\u2019`]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Ubah slug kembali menjadi nama tampilan: "bu-ati" → "Bu Ati". */
export function guestNameFromSlug(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
