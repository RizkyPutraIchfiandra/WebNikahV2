/**
 * Lapisan data Buku Tamu (RSVP + Ucapan).
 *
 * - Jika VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY tersedia (lihat .env),
 *   data disimpan online di Supabase dan dibaca semua tamu.
 * - Jika belum, otomatis memakai penyimpanan lokal browser (mode uji coba).
 *
 * Komponen UI hanya berbicara dengan `guestbookStore`.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type Attendance = "hadir" | "tidak-hadir";

export type WishEntry = {
  id: string;
  name: string;
  attendance: Attendance;
  guests: number;
  message: string;
  createdAt: string;
};

export type NewWishEntry = Omit<WishEntry, "id" | "createdAt">;

export interface GuestbookStore {
  list(): Promise<WishEntry[]>;
  add(entry: NewWishEntry): Promise<WishEntry>;
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

const supabase: SupabaseClient | null =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export const guestbookMode: "supabase" | "local" = supabase ? "supabase" : "local";

/* ————————————— Supabase ————————————— */

type WishRow = {
  id: string;
  name: string;
  attendance: Attendance;
  guests: number;
  message: string;
  created_at: string;
};

const fromRow = (row: WishRow): WishEntry => ({
  id: row.id,
  name: row.name,
  attendance: row.attendance,
  guests: row.guests,
  message: row.message,
  createdAt: row.created_at,
});

const supabaseStore: GuestbookStore | null = supabase
  ? {
      async list() {
        const { data, error } = await supabase
          .from("wishes")
          .select("id,name,attendance,guests,message,created_at")
          .order("created_at", { ascending: false })
          .limit(500);
        if (error) throw new Error(error.message);
        return (data as WishRow[]).map(fromRow);
      },
      async add(entry) {
        const { data, error } = await supabase
          .from("wishes")
          .insert({
            name: entry.name,
            attendance: entry.attendance,
            guests: entry.guests,
            message: entry.message,
          })
          .select("id,name,attendance,guests,message,created_at")
          .single();
        if (error) throw new Error(error.message);
        return fromRow(data as WishRow);
      },
    }
  : null;

/* ————————————— Lokal (mode uji coba) ————————————— */

const STORAGE_KEY = "wedding-guestbook-v2";

const seed: WishEntry[] = [
  {
    id: "seed-1",
    name: "Dimas & Sari",
    attendance: "hadir",
    guests: 2,
    message:
      "Selamat menempuh hidup baru Dimas & Intan! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah.",
    createdAt: "2026-06-02T09:12:00.000Z",
  },
  {
    id: "seed-2",
    name: "Nadia Puspita",
    attendance: "hadir",
    guests: 1,
    message: "Bahagia selalu untuk kalian berdua. Sampai jumpa di hari bahagia!",
    createdAt: "2026-06-04T14:40:00.000Z",
  },
  {
    id: "seed-3",
    name: "Bagas Herlambang",
    attendance: "tidak-hadir",
    guests: 0,
    message:
      "Maaf belum bisa hadir. Doa terbaik selalu menyertai perjalanan kalian. Barakallahu lakuma.",
    createdAt: "2026-06-08T03:05:00.000Z",
  },
  {
    id: "seed-4",
    name: "Keluarga Wijaya",
    attendance: "hadir",
    guests: 4,
    message:
      "Turut berbahagia! Semoga hari istimewa kalian berjalan lancar dan penuh berkah.",
    createdAt: "2026-06-12T11:20:00.000Z",
  },
];

function readLocal(): WishEntry[] {
  if (typeof window === "undefined") return seed;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return seed;
    const parsed = JSON.parse(raw) as WishEntry[];
    return Array.isArray(parsed) ? parsed : seed;
  } catch {
    return seed;
  }
}

function writeLocal(entries: WishEntry[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    /* penyimpanan tidak tersedia — biarkan berjalan di memori */
  }
}

const localStore: GuestbookStore = {
  async list() {
    return readLocal();
  },
  async add(entry) {
    const created: WishEntry = {
      ...entry,
      id: `w-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      createdAt: new Date().toISOString(),
    };
    writeLocal([created, ...readLocal()]);
    return created;
  },
};

export const guestbookStore: GuestbookStore = supabaseStore ?? localStore;

export function formatWishTime(iso: string, language: "id" | "en" = "id") {
  try {
    return new Intl.DateTimeFormat(language === "id" ? "id-ID" : "en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return "";
  }
}
