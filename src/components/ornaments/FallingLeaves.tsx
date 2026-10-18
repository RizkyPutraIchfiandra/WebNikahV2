import type { CSSProperties } from "react";

import { LeafIcon } from "./ornaments";

type LeafSpec = {
  left: number;
  size: number;
  duration: number;
  delay: number;
  sway: number;
  swayPx: number;
  spin: number;
  opacity: number;
  variant: 0 | 1 | 2;
};

/** Spesifikasi tetap (deterministik) — sebaran lembut di seluruh layar. */
const LEAVES: LeafSpec[] = [
  { left: 4, size: 15, duration: 22, delay: -2, sway: 4.6, swayPx: 26, spin: 13, opacity: 0.28, variant: 0 },
  { left: 12, size: 20, duration: 17, delay: -9, sway: 3.8, swayPx: 38, spin: 9, opacity: 0.22, variant: 1 },
  { left: 21, size: 13, duration: 26, delay: -14, sway: 5.2, swayPx: 22, spin: 16, opacity: 0.34, variant: 2 },
  { left: 30, size: 17, duration: 19, delay: -5, sway: 4.1, swayPx: 30, spin: 11, opacity: 0.2, variant: 0 },
  { left: 39, size: 14, duration: 24, delay: -18, sway: 4.8, swayPx: 24, spin: 14, opacity: 0.3, variant: 1 },
  { left: 48, size: 21, duration: 16, delay: -11, sway: 3.5, swayPx: 42, spin: 8, opacity: 0.18, variant: 0 },
  { left: 57, size: 15, duration: 21, delay: -3, sway: 4.4, swayPx: 28, spin: 12, opacity: 0.26, variant: 2 },
  { left: 66, size: 18, duration: 18, delay: -15, sway: 3.9, swayPx: 34, spin: 10, opacity: 0.21, variant: 1 },
  { left: 75, size: 13, duration: 25, delay: -7, sway: 5, swayPx: 22, spin: 15, opacity: 0.32, variant: 0 },
  { left: 83, size: 19, duration: 17, delay: -12, sway: 3.7, swayPx: 36, spin: 9.5, opacity: 0.2, variant: 2 },
  { left: 91, size: 14, duration: 23, delay: -4, sway: 4.7, swayPx: 25, spin: 13.5, opacity: 0.3, variant: 1 },
  { left: 97, size: 16, duration: 20, delay: -16, sway: 4, swayPx: 30, spin: 11.5, opacity: 0.24, variant: 0 },
];

const PALETTE: Record<"light" | "dark", string[]> = {
  light: ["#a8842c", "#6e8a7b", "#b8913a", "#5e7a6c", "#c9a94a", "#7e9a8b"],
  dark: ["#d4af37", "#e7ce8f", "#9db8a9", "#c9a94a", "#efe6cf", "#8fa898"],
};

/**
 * Daun jatuh — lapisan tetap di belakang navigasi, transparan, tidak bisa
 * tersentuh kursor, dan otomatis nonaktif saat prefers-reduced-motion.
 */
export function FallingLeaves({
  tone = "light",
  count = 12,
}: {
  tone?: "light" | "dark";
  count?: number;
}) {
  const palette = PALETTE[tone];

  return (
    <div
      className="leaf-layer pointer-events-none fixed inset-0 z-[6] overflow-hidden"
      aria-hidden="true"
    >
      {LEAVES.slice(0, count).map((leaf, index) => (
        <span
          key={index}
          className="leaf-fall"
          style={{
            left: `${leaf.left}%`,
            animationDuration: `${leaf.duration}s`,
            animationDelay: `${leaf.delay}s`,
            opacity: leaf.opacity,
          }}
        >
          <span
            className="leaf-sway"
            style={
              {
                animationDuration: `${leaf.sway}s`,
                "--sway": `${leaf.swayPx}px`,
              } as CSSProperties
            }
          >
            <LeafIcon
              variant={leaf.variant}
              className="leaf-spin"
              style={{
                width: leaf.size,
                height: "auto",
                color: palette[index % palette.length],
                animationDuration: `${leaf.spin}s`,
              }}
            />
          </span>
        </span>
      ))}
    </div>
  );
}
