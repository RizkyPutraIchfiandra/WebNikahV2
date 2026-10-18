/**
 * Mengolah aset mentah (assets-src/) menjadi aset web:
 *   - Foto JPG/PNG → WebP (maks 1600 px, kualitas 80) di src/assets/photos/
 *   - Audio        → disalin ke src/assets/audio/
 *   - favicon.svg  → ikon PNG (apple-touch-icon 180, 192, 512) di public/icons/
 *   - og-image.png 1200×630 untuk pratinjau WhatsApp & media sosial di public/
 *
 * Jalankan:  bun run assets
 */
import { existsSync } from "node:fs";
import { copyFile, mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const photosIn = path.join(root, "assets-src", "photos");
const photosOut = path.join(root, "src", "assets", "photos");
const audioIn = path.join(root, "assets-src", "audio");
const audioOut = path.join(root, "src", "assets", "audio");
const iconsOut = path.join(root, "public", "icons");

const OG_SVG = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="glow" cx="50%" cy="38%" r="70%">
      <stop offset="0%" stop-color="#2c5545"/>
      <stop offset="100%" stop-color="#0d291e"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <rect x="34" y="34" width="1132" height="562" fill="none" stroke="#d4af37" stroke-width="2" opacity="0.85"/>
  <rect x="48" y="48" width="1104" height="534" fill="none" stroke="#d4af37" stroke-width="1" opacity="0.4"/>
  <text x="600" y="218" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="28" letter-spacing="16" fill="#d4af37">THE WEDDING OF</text>
  <text x="600" y="352" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="112" fill="#f7eedb">Dimas &amp; Intan</text>
  <path d="M600 398 l7 14 -7 14 -7 -14 z" fill="#d4af37"/>
  <line x1="430" y1="412" x2="566" y2="412" stroke="#d4af37" stroke-width="1.5" opacity="0.7"/>
  <line x1="634" y1="412" x2="770" y2="412" stroke="#d4af37" stroke-width="1.5" opacity="0.7"/>
  <text x="600" y="470" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="34" letter-spacing="9" fill="#d4af37">06 . 12 . 2026</text>
  <text x="600" y="528" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="21" fill="#9db8a9">Minggu, 6 Desember 2026 · Karawang, Jawa Barat</text>
</svg>`;

async function processPhotos() {
  if (!existsSync(photosIn)) {
    console.log("(!) assets-src/photos tidak ditemukan — dilewati");
    return;
  }
  await mkdir(photosOut, { recursive: true });
  const files = (await readdir(photosIn)).filter((file) => /\.(jpe?g|png)$/i.test(file));
  for (const file of files) {
    const target = path.join(photosOut, file.replace(/\.(jpe?g|png)$/i, ".webp"));
    const info = await sharp(path.join(photosIn, file))
      .rotate()
      .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 80, effort: 5 })
      .toFile(target);
    console.log(`✓ ${file} → ${path.basename(target)} (${Math.round(info.size / 1024)} KB)`);
  }
}

async function processAudio() {
  if (!existsSync(audioIn)) {
    console.log("(!) assets-src/audio tidak ditemukan — dilewati");
    return;
  }
  await mkdir(audioOut, { recursive: true });
  const files = (await readdir(audioIn)).filter((file) =>
    /\.(mp3|m4a|ogg|wav)$/i.test(file),
  );
  for (const file of files) {
    await copyFile(path.join(audioIn, file), path.join(audioOut, file));
    console.log(`✓ audio → ${file}`);
  }
}

async function processIcons() {
  await mkdir(iconsOut, { recursive: true });
  const favicon = path.join(root, "public", "favicon.svg");
  if (existsSync(favicon)) {
    await sharp(favicon).resize(180, 180).png().toFile(path.join(iconsOut, "apple-touch-icon.png"));
    await sharp(favicon).resize(192, 192).png().toFile(path.join(iconsOut, "icon-192.png"));
    await sharp(favicon).resize(512, 512).png().toFile(path.join(iconsOut, "icon-512.png"));
    console.log("✓ ikon PWA dibuat (apple-touch-icon, 192, 512)");
  }
  await sharp(Buffer.from(OG_SVG)).png().toFile(path.join(root, "public", "og-image.png"));
  console.log("✓ og-image.png (1200×630) dibuat");
}

await processPhotos();
await processAudio();
await processIcons();

console.log("\nSelesai — lanjut `bun run dev` atau `bun run build`.");
