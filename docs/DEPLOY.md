# Panduan Deploy

Satu hasil build (`dist/`) dapat dipakai untuk **Vercel** maupun **InfinityFree**.
Jalankan dulu:

```bash
bun run build
```

---

## Opsi A — Vercel (disarankan: gratis, HTTPS otomatis, CDN cepat)

### Cara 1 — lewat GitHub (deploy otomatis setiap push)

1. Buat repositori baru di **https://github.com/new**
   (nama bebas, mis. `webnikahan-premium`; boleh **Private**).
2. Di folder proyek, hubungkan dan dorong kode:

   ```bash
   git remote add origin https://github.com/USERNAME/webnikahan-premium.git
   git push -u origin main
   ```

3. Buka **https://vercel.com** → daftar dengan akun GitHub → **Add New… → Project**
   → **Import** repositori tadi.
4. Vercel mengenali **Vite** otomatis (Build `vite build`, Output `dist`). Klik **Deploy**.
5. Selesai — alamat Anda: `https://nama-proyek.vercel.app`

### Cara 2 — lewat CLI (tanpa GitHub)

```bash
bunx vercel         # deploy pratinjau
bunx vercel --prod  # deploy produksi
```

### Variabel lingkungan Supabase (bila RSVP online aktif)

Vercel → proyek → **Settings → Environment Variables** → tambahkan:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

lalu **Deployments → … → Redeploy** agar terpasang.

### Domain sendiri (mis. `dimasintan.com`)

**Settings → Domains → Add** → ikuti instruksi (mengarahkan nameserver/DNS).
SSL otomatis. Setelah domain aktif, perbarui `og:image` di `index.html` menjadi
URL lengkap, mis. `https://dimasintan.com/og-image.png`, lalu build & push ulang.

> `vercel.json` sudah menyiapkan: SPA fallback (rute `/buat-link`), cache aset
> 1 tahun (*immutable*), dan header keamanan dasar.

---

## Opsi B — InfinityFree (hosting statis gratis)

### 1. Siapkan hosting

1. Daftar di **https://infinityfree.com** → **Create Account**.
2. Pilih subdomain gratis (mis. `dimasintan.kesug.com`), catat **username &
   password** akun hosting Anda.

### 2. Unggah hasil build

**Lewat FTP (disarankan — FileZilla):**

1. Control Panel InfinityFree → **FTP Details**: host `ftpupload.net`, port `21`.
2. Hubungkan FileZilla → masuk folder **`htdocs`**.
3. Unggah **seluruh isi** folder `dist/` (bukan folder `dist`-nya) ke `htdocs`.
4. Penting: aktifkan *Server → Force showing hidden files* agar **`.htaccess`**
   ikut terunggah.

**Lewat Online File Manager:**

1. Control Panel → **Online File Manager** → masuk `htdocs` → hapus `index2.html` bawaan.
2. Unggah isi `dist/` (praktis: buat zip dari isi `dist/`, unggah, lalu ekstrak di sana).

### 3. Pastikan rute bekerja

`dist/.htaccess` mengarahkan semua rute ke `index.html` sehingga `/buat-link`
tidak 404. Bila lupa terunggah, unggah ulang berkas itu (mode biner).

### 4. Domain sendiri

1. Control Panel → **Addon Domains / Parked Domains** → tambahkan domain Anda.
2. Arahkan DNS ke nameserver InfinityFree (`ns1.epizy.com`, `ns2.epizy.com`)
   atau ikuti wizard yang muncul.
3. Setelah domain aktif (propagasi bisa beberapa jam), aktifkan **Free SSL**
   di Control Panel.

### Batasan yang perlu diketahui

- **Maksimum 10 MB per berkas.** Musik saat ini ±8,5 MB — masih aman. Bila ingin
  lebih ringan: `ffmpeg -i musik.mp3 -b:a 128k musik-kecil.mp3`, letakkan di
  `assets-src/audio/`, lalu `bun run assets`.
- Tidak ada dukungan Node.js — aman karena situs sepenuhnya statis.
- Kecepatan lebih lambat daripada Vercel (tanpa CDN global).

---

## Checklist Pasca-Deploy

- [ ] Beranda terbuka → amplop pembuka muncul, nama tamu dari `?to=` tampil
- [ ] Musik mulai setelah tombol **Buka Undangan** ditekan (dan bisa dibisukan)
- [ ] **Simpan ke Kalender** mengunduh `.ics` yang benar
- [ ] **Petunjuk Arah** membuka Google Maps sesuai lokasi
- [ ] Peta memuat & pin menunjuk lokasi tepat
- [ ] Kirim RSVP percobaan (pastikan catatan "mode uji coba" hilang bila Supabase aktif)
- [ ] Buka `/buat-link` → tempel 2–3 nama → coba **Salin**, **WA**, **Unduh CSV**
- [ ] Buka `https://domain-anda/?to=Budi` → nama "Budi" muncul di pembuka
- [ ] Kirim link ke diri sendiri di WhatsApp → pratinjau (judul + gambar) tampil
- [ ] Cek di ponsel: navigasi bawah, daun jatuh, dan pemutar musik berjalan mulus

## Setelah Hari-H

- Undangan boleh dibiarkan online sebagai kenang-kenangan, atau
- Nonaktifkan proyek Supabase / ganti isi situs dengan halaman ucapan terima kasih.
