# Undangan Pernikahan — Dimas & Intan

Undangan pernikahan digital bertema **Botanical Luxury** (emerald, emas, botani) —
dibangun sebagai situs statis modern: Vite + React + TypeScript + Tailwind CSS v4
+ Framer Motion.

**Pernikahan:** Dimas Ichfianto & Ai Intan Sunarsih · Minggu, 6 Desember 2026 · Karawang

---

## Fitur

- **Pembuka personal** — nama tamu otomatis dari link personal (`/nama-tamu`; format lama `?to=Nama+Tamu` tetap didukung)
- **Hitungan mundur** menuju 6 Desember 2026, 09.00 WIB
- **Ayat & doa** — QS Ar-Rum: 21
- **Mempelai & kisah cinta** — profil lengkap + 4 babak perjalanan
- **Rangkaian acara** — akad & resepsi, tombol **Simpan ke Kalender** (.ics),
  **Petunjuk Arah** (Google Maps), peta interaktif dengan pin custom
- **Galeri** — masonry + lightbox (swipe & keyboard)
- **Hadiah cashless** — salin nomor rekening dengan satu klik; slot QRIS siap pakai
- **RSVP + buku tamu** — Supabase (online) atau otomatis *mode uji coba lokal*
- **Pemutar musik** — gaya kartu: vinyl → kartu penuh dengan progres & volume
- **Generator link tamu** — halaman `/buat-link`: salin semua, unduh CSV, kirim WhatsApp
- **Bilingual** — toggle Indonesia ⇆ English (tersimpan di peramban)
- **Animasi daun jatuh**, ornamen botani SVG custom (bebas lisensi), amplop pembuka

## Menjalankan

```bash
bun install      # sekali saja
bun run dev      # pengembangan → http://localhost:5173
bun run build    # build produksi → folder dist/
bun run preview  # pratinjau hasil build
bun run assets   # olah ulang aset (foto → WebP, ikon, og-image)
```

## Mengubah Konten

| Ingin mengubah…                                  | Berkas                             |
| ------------------------------------------------ | ---------------------------------- |
| Nama, tanggal, alamat, rekening, koordinat, dsb. | `src/data/weddingConfig.ts`        |
| Semua teks tampilan (Indonesia & Inggris)        | `src/lib/i18n.tsx`                 |
| Warna, font, dan gaya visual                     | `src/styles.css`                   |
| Ornamen botani SVG                               | `src/components/ornaments/`        |

### Mengganti / menambah foto

1. Letakkan foto baru di `assets-src/photos/` (JPG/PNG)
2. Jalankan `bun run assets` — otomatis dikonversi ke WebP (maks 1600 px)
3. Daftarkan di `weddingConfig.ts` → `media.galleryImages`,
   `couple.groom.photo`, `couple.bride.photo`, atau `media.heroImage`

### Mengganti musik

1. Letakkan berkas mp3 di `assets-src/audio/`
2. Jalankan `bun run assets`
3. Sesuaikan `media.musicTitle` / `media.musicArtist` di `weddingConfig.ts`

> Tip: batas unggah InfinityFree adalah 10 MB per berkas. Bila musik melebihi itu,
> kompres dengan `ffmpeg -i asli.mp3 -b:a 128k kecil.mp3` lalu olah ulang.

### Menyalakan QRIS

Taruh gambar QRIS di `public/qris.png`, lalu isi `gift.qris: "/qris.png"` di
`weddingConfig.ts`. Selama kosong, blok QRIS otomatis disembunyikan.

### RSVP online (Supabase)

Ikuti panduan langkah demi langkah: [`docs/SUPABASE-SETUP.md`](docs/SUPABASE-SETUP.md).
Tanpa Supabase, formulir tetap berjalan dalam *mode uji coba* — data tersimpan di
peramban tamu dan ditandai jelas pada antarmuka.

## Deploy

Panduan lengkap untuk **Vercel** dan **InfinityFree**: [`docs/DEPLOY.md`](docs/DEPLOY.md).

- **Vercel** — impor repositori GitHub; Vite terdeteksi otomatis. `vercel.json`
  sudah menangani SPA fallback, cache aset, dan header keamanan.
- **InfinityFree** — unggah seluruh isi `dist/` ke `htdocs` (termasuk `.htaccess`
  tersembunyi agar rute `/buat-link` bekerja).

Satu hasil `bun run build` dapat dipakai untuk keduanya.

## Struktur

```
scripts/process-assets.mjs    # pengolah aset (WebP, ikon PWA, og-image)
public/                       # statis: favicon, .htaccess, manifest, robots, og-image
src/
  assets/                     # hasil olahan aset (webp, mp3) — dari `bun run assets`
  components/
    common/                   # Reveal, SectionTitle, Toast, Preloader
    ornaments/                # perpustakaan SVG botani + daun jatuh
    opening/  hero/           # amplop pembuka & hero
    countdown/  quote/        # hitung mundur & ayat
    couple/   story/          # mempelai & kisah cinta
    event/    gallery/        # acara, peta & galeri
    gift/     rsvp/           # hadiah & RSVP + buku tamu
    closing/  music/          # penutup & pemutar musik
    nav/                      # navigasi mengapung
  data/weddingConfig.ts       # seluruh data faktual pernikahan
  lib/                        # i18n, guestbook (Supabase), ICS, clipboard
  pages/                      # `/` undangan · `/buat-link` generator link tamu
docs/                         # panduan Supabase & deploy
assets-src/                   # sumber mentah foto & audio (tidak ikut git)
```

## Catatan

- Situs ditandai **noindex** (tidak muncul di pencarian) — lihat `public/robots.txt`
- Setelah deploy, perbarui `og:image` di `index.html` menjadi URL lengkap
  (`https://domain-anda.com/og-image.png`) agar pratinjau WhatsApp muncul benar
- Peta memakai ubin CARTO/OpenStreetMap — gratis untuk pemakaian wajar
