# Panduan RSVP Online dengan Supabase (dari nol)

Supabase adalah layanan basis data gratis untuk menyimpan konfirmasi kehadiran
(RSVP) dan ucapan tamu.

> **Tanpa Supabase, undangan tetap berjalan normal.** Formulir masuk *mode uji
> coba*: ucapan tersimpan di peramban masing-masing tamu dan ditandai jelas di
> antarmuka. Panduan ini membuat ucapan tersimpan online dan terlihat semua tamu.

Perkiraan waktu: **±10 menit** · Biaya: **gratis**

---

## 1. Buat akun & proyek

1. Buka **https://supabase.com** → **Start your project** → daftar
   (bisa memakai akun GitHub/Google).
2. Klik **New project**, isi:
   - **Name**: `webnikahan` (bebas)
   - **Database Password**: klik *Generate a password* → **simpan di tempat aman**
   - **Region**: pilih **Southeast Asia (Singapore)** — tercepat dari Indonesia
3. Klik **Create new project** → tunggu 1–2 menit sampai provisi selesai.

## 2. Buat tabel & aturan keamanan

1. Sidebar kiri → **SQL Editor** → **New query**.
2. Salin-tempel **seluruh** kode di bawah, lalu klik **Run** (Ctrl+Enter):

```sql
-- Tabel buku tamu
create table if not exists public.wishes (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 80),
  attendance text not null check (attendance in ('hadir', 'tidak-hadir')),
  guests integer not null default 0 check (guests between 0 and 10),
  message text not null check (char_length(message) between 1 and 500),
  created_at timestamptz not null default now()
);

-- Wajib: aktifkan keamanan baris
alter table public.wishes enable row level security;

-- Tamu boleh membaca semua ucapan
create policy "wishes_public_read"
  on public.wishes for select
  using (true);

-- Tamu boleh menambah ucapan
create policy "wishes_public_insert"
  on public.wishes for insert
  with check (true);

-- Percepat pengurutan terbaru
create index if not exists wishes_created_at_idx
  on public.wishes (created_at desc);
```

3. Pastikan muncul **Success. No rows returned** — berarti tabel siap.

## 3. Ambil kunci API

1. Sidebar → **Project Settings** (ikon gerigi) → **API**.
2. Catat dua nilai:
   - **Project URL** — contoh: `https://abcdefgh.supabase.co`
   - **anon public** — kunci panjang di bagian *Project API keys*

## 4. Hubungkan ke undangan

1. Di folder proyek, **salin** `.env.example` menjadi `.env`, lalu isi:

   ```env
   VITE_SUPABASE_URL=https://abcdefgh.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (anon key Anda)
   ```

2. Simpan. Untuk pengembangan: hentikan lalu jalankan ulang `bun run dev`.
3. Untuk **Vercel**: **Settings → Environment Variables** → tambahkan kedua
   variabel dengan nama yang sama → **Redeploy** proyek.

## 5. Uji

1. Buka undangan → bagian **RSVP & Ucapan**.
2. Catatan *"Mode uji coba…"* harus **hilang** (tanda sudah online).
3. Kirim satu ucapan uji → langsung muncul di daftar.
4. Cek juga di Supabase: **Table Editor → wishes** — baris baru harus ada.

---

## Pertanyaan Umum

**Apakah `anon key` aman dipakai di sisi depan (terlihat publik)?**
Ya — selama **Row Level Security aktif** dan policy hanya *select* + *insert*
seperti SQL di atas. Kunci ini memang dirancang untuk peramban. Jangan pernah
memakai *service_role key* di sisi depan.

**Proyek gratis dikatakan "tertidur"?**
Proyek gratis Supabase dijeda otomatis setelah ±1 minggu tanpa aktivitas.
Bila RSVP tiba-tiba gagal: buka dashboard Supabase → **Restore/Unpause** proyek.
Mulai beberapa minggu sebelum hari-H, buka dashboard sekali seminggu agar tetap aktif.

**Menghapus ucapan spam / menguji pembersihan?**
Supabase → **Table Editor** → `wishes` → hapus baris yang diinginkan. Tidak ada
halaman admin bawaan — sengaja dibuat sederhana dan aman.

**Ingin mengganti nama tabel?**
Tidak disarankan (SQL di atas memakai `wishes`). Bila tetap ingin, sesuaikan juga
`src/lib/guestbook.ts`.

**Batas gratis?**
±500 MB basis data dan 5 GB bandwidth/bulan — jauh lebih dari cukup untuk ribuan
ucapan undangan.
