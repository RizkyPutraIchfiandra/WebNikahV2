import { useEffect, useMemo, useState } from "react";

/* ————— Hitung mundur menuju hari bahagia ————— */
export function useCountdown(target: string) {
  const targetTime = useMemo(() => new Date(target).getTime(), [target]);

  const [state, setState] = useState(() => calc(targetTime));

  useEffect(() => {
    const id = window.setInterval(() => setState(calc(targetTime)), 1000);
    return () => window.clearInterval(id);
  }, [targetTime]);

  return state;
}

function calc(targetTime: number) {
  const diff = Math.max(0, targetTime - Date.now());
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    done: diff <= 0,
  };
}

/* ————— Section yang sedang aktif (untuk navigasi) ————— */
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0] ?? "");
  const key = ids.join("|");

  useEffect(() => {
    const elements = key
      .split("|")
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-42% 0px -52% 0px", threshold: 0 },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [key]);

  return active;
}

/* ————— Kunci scroll halaman (saat opening / lightbox) ————— */
export function useBodyLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [locked]);
}

/* ————— Sudah digulir melewati ambang tertentu? ————— */
export function useScrolledPast(threshold = 800) {
  const [past, setPast] = useState(false);

  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return past;
}
