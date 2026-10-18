import { useMemo, type CSSProperties } from "react";

/**
 * Semua ornamen botani digambar sendiri sebagai SVG (aman lisensi, tajam di
 * segala ukuran, warna mengikuti `currentColor`).
 */

/* ————— Utilitas kurva ————— */
function cubic(p0: number, p1: number, p2: number, p3: number, t: number) {
  const u = 1 - t;
  return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3;
}

const STEM_X = [60, 46, 76, 58];
const STEM_Y = [224, 148, 84, 16];

type SprigLeaf = {
  cx: number;
  cy: number;
  angle: number;
  rx: number;
  ry: number;
  opacity: number;
};

function buildSprig(leafCount: number): { stem: string; leaves: SprigLeaf[] } {
  const stem = `M ${STEM_X[0]} ${STEM_Y[0]} C ${STEM_X[1]} ${STEM_Y[1]}, ${STEM_X[2]} ${STEM_Y[2]}, ${STEM_X[3]} ${STEM_Y[3]}`;
  const leaves: SprigLeaf[] = [];

  for (let i = 0; i < leafCount; i += 1) {
    const t = 0.16 + (i / Math.max(1, leafCount - 1)) * 0.72;
    const x = cubic(STEM_X[0], STEM_X[1], STEM_X[2], STEM_X[3], t);
    const y = cubic(STEM_Y[0], STEM_Y[1], STEM_Y[2], STEM_Y[3], t);
    const dx =
      cubic(STEM_X[0], STEM_X[1], STEM_X[2], STEM_X[3], t + 0.02) - x;
    const dy =
      cubic(STEM_Y[0], STEM_Y[1], STEM_Y[2], STEM_Y[3], t + 0.02) - y;
    const stemAngle = (Math.atan2(dy, dx) * 180) / Math.PI;
    const side = i % 2 === 0 ? -1 : 1;
    const angle = stemAngle + side * 58;
    const ry = 15.5 - i * 0.5;
    const rx = ry * 0.4;
    const rad = (angle * Math.PI) / 180;
    leaves.push({
      cx: x + Math.cos(rad) * ry * 0.8,
      cy: y + Math.sin(rad) * ry * 0.8,
      angle,
      rx,
      ry,
      opacity: i % 2 === 0 ? 0.85 : 0.6,
    });
  }

  // Daun pucuk mengikuti arah ujung tangkai
  const tipX = cubic(STEM_X[0], STEM_X[1], STEM_X[2], STEM_X[3], 0.995);
  const tipY = cubic(STEM_Y[0], STEM_Y[1], STEM_Y[2], STEM_Y[3], 0.995);
  const tipDx = STEM_X[3] - cubic(STEM_X[0], STEM_X[1], STEM_X[2], STEM_X[3], 0.94);
  const tipDy = STEM_Y[3] - cubic(STEM_Y[0], STEM_Y[1], STEM_Y[2], STEM_Y[3], 0.94);
  const tipAngle = (Math.atan2(tipDy, tipDx) * 180) / Math.PI;
  const tipRad = (tipAngle * Math.PI) / 180;
  leaves.push({
    cx: tipX + Math.cos(tipRad) * 8,
    cy: tipY + Math.sin(tipRad) * 8,
    angle: tipAngle,
    rx: 5,
    ry: 12,
    opacity: 0.95,
  });

  return { stem, leaves };
}

/** Ranting eucalyptus sebagai elemen <g> — bisa disusun di dalam SVG lain. */
export function EucalyptusGeom({
  leaves = 9,
  opacity = 1,
}: {
  leaves?: number;
  opacity?: number;
}) {
  const sprig = useMemo(() => buildSprig(leaves), [leaves]);

  return (
    <g opacity={opacity}>
      <path
        d={sprig.stem}
        fill="none"
        stroke="currentColor"
        strokeWidth={2.1}
        strokeLinecap="round"
        opacity={0.7}
      />
      {sprig.leaves.map((leaf, index) => (
        <ellipse
          key={index}
          cx={leaf.cx}
          cy={leaf.cy}
          rx={leaf.rx}
          ry={leaf.ry}
          transform={`rotate(${leaf.angle} ${leaf.cx} ${leaf.cy})`}
          fill="currentColor"
          opacity={leaf.opacity}
        />
      ))}
    </g>
  );
}

/** Ranting eucalyptus berdiri sendiri (untuk hiasan sudut & samping). */
export function EucalyptusSprig({
  className,
  leaves,
}: {
  className?: string;
  leaves?: number;
}) {
  return (
    <svg viewBox="0 0 120 240" className={className} aria-hidden="true">
      <EucalyptusGeom leaves={leaves} />
    </svg>
  );
}

/**
 * Sebaran botani sudut (orientasi kanan-bawah dari kiri atas).
 * Cermin dengan CSS: scaleX(-1) / scaleY(-1) / scale(-1,-1).
 */
export function CornerSpray({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg viewBox="0 0 320 320" className={className} style={style} aria-hidden="true">
      <g transform="translate(-30 -180)">
        <g transform="rotate(112 60 224)">
          <EucalyptusGeom leaves={9} opacity={0.95} />
        </g>
        <g transform="rotate(150 60 224)">
          <EucalyptusGeom leaves={8} opacity={0.8} />
        </g>
        <g transform="rotate(84 60 224)">
          <EucalyptusGeom leaves={7} opacity={0.8} />
        </g>
        <g fill="currentColor" opacity={0.7}>
          <circle cx="76" cy="214" r="2.6" />
          <circle cx="58" cy="206" r="2.2" />
          <circle cx="94" cy="200" r="2.4" />
          <circle cx="48" cy="196" r="2" />
          <circle cx="104" cy="188" r="2.1" />
        </g>
      </g>
    </svg>
  );
}

/** Pembatas elegan: garis — daun + intan — garis. */
export function LeafDivider({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 360 30" className={className} aria-hidden="true">
      <path d="M6 15 H140" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <path d="M220 15 H354" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <path d="M180 4 L187 15 L180 26 L173 15 Z" fill="currentColor" opacity="0.9" />
      <path
        d="M158 15 C 163 8.6, 170 6.8, 176 9 C 172.8 13.4, 167 15.8, 161 16.2 Z"
        fill="currentColor"
        opacity="0.75"
      />
      <path
        d="M202 15 C 197 8.6, 190 6.8, 184 9 C 187.2 13.4, 193 15.8, 199 16.2 Z"
        fill="currentColor"
        opacity="0.75"
      />
    </svg>
  );
}

/** Ornamen kecil di atas judul section. */
export function SectionOrnament({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 18" className={className} aria-hidden="true">
      <path d="M8 9 H52" stroke="currentColor" strokeWidth="1" opacity="0.45" />
      <path d="M88 9 H132" stroke="currentColor" strokeWidth="1" opacity="0.45" />
      <path d="M70 2.5 L75 9 L70 15.5 L65 9 Z" fill="currentColor" opacity="0.85" />
      <path
        d="M56 9 C 59.5 5.4, 64 4.6, 67 6.2 C 65 9.2, 61.5 10.6, 57.5 10.8 Z"
        fill="currentColor"
        opacity="0.7"
      />
      <path
        d="M84 9 C 80.5 5.4, 76 4.6, 73 6.2 C 75 9.2, 78.5 10.6, 82.5 10.8 Z"
        fill="currentColor"
        opacity="0.7"
      />
    </svg>
  );
}

/** Mahkota kecil di puncak bingkai lengkung foto. */
export function ArchCrown({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 96 44" className={className} aria-hidden="true">
      <g fill="currentColor">
        <path d="M48 8 C 51.6 16, 51.6 28, 48 38 C 44.4 28, 44.4 16, 48 8 Z" opacity="0.95" />
        <path
          d="M48 14 C 50.8 20, 50.8 29, 48 37 C 45.2 29, 45.2 20, 48 14 Z"
          opacity="0.8"
          transform="rotate(-36 48 38)"
        />
        <path
          d="M48 14 C 50.8 20, 50.8 29, 48 37 C 45.2 29, 45.2 20, 48 14 Z"
          opacity="0.8"
          transform="rotate(36 48 38)"
        />
      </g>
      <g fill="currentColor" opacity="0.55">
        <circle cx="30" cy="40" r="2" />
        <circle cx="66" cy="40" r="2" />
      </g>
    </svg>
  );
}

/** Segel monogram D & I. */
export function MonogramSeal({
  className,
  label = "Dimas & Intan",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      role="img"
      aria-label={label}
      style={{ fontFamily: "var(--font-display)" }}
    >
      <circle cx="100" cy="100" r="94" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.55" />
      <circle
        cx="100"
        cy="100"
        r="86"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.4"
        strokeDasharray="1 5"
        strokeLinecap="round"
      />
      <path d="M100 2 C 103.5 7, 103.5 13, 100 18 C 96.5 13, 96.5 7, 100 2 Z" fill="currentColor" opacity="0.9" />
      <path
        d="M100 182 C 103.5 187, 103.5 193, 100 198 C 96.5 193, 96.5 187, 100 182 Z"
        fill="currentColor"
        opacity="0.9"
      />
      <text x="72" y="122" textAnchor="middle" fontSize="58" fill="currentColor">
        D
      </text>
      <text x="100" y="118" textAnchor="middle" fontSize="30" fill="currentColor" opacity="0.85">
        &amp;
      </text>
      <text x="129" y="122" textAnchor="middle" fontSize="58" fill="currentColor">
        I
      </text>
      <text
        x="100"
        y="150"
        textAnchor="middle"
        fontSize="10.5"
        letterSpacing="3.5"
        fill="currentColor"
        opacity="0.8"
        style={{ fontFamily: "var(--font-body)" }}
      >
        06 · 12 · 2026
      </text>
    </svg>
  );
}

/* ————— Bentuk daun untuk animasi jatuh ————— */
export function LeafIcon({
  variant = 0,
  className,
  style,
}: {
  variant?: 0 | 1 | 2;
  className?: string;
  style?: CSSProperties;
}) {
  if (variant === 1) {
    return (
      <svg viewBox="0 0 24 34" className={className} style={style} aria-hidden="true">
        <path
          d="M12 1 C 20 9, 22.4 17.4, 18.6 24.6 C 16.4 28.7, 13.4 31.4, 12 32.6 C 10.6 31.4, 7.6 28.7, 5.4 24.6 C 1.6 17.4, 4 9, 12 1 Z"
          fill="currentColor"
        />
        <path d="M12 5 L12 29" stroke="rgba(255,253,247,0.5)" strokeWidth="0.8" />
      </svg>
    );
  }

  if (variant === 2) {
    return (
      <svg viewBox="0 0 30 34" className={className} style={style} aria-hidden="true">
        <path
          d="M15 33 C 15 26, 14 20, 10 15"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity="0.8"
        />
        <ellipse cx="8" cy="13" rx="3.4" ry="7.6" fill="currentColor" transform="rotate(-28 8 13)" />
        <ellipse cx="15" cy="10" rx="3.4" ry="8" fill="currentColor" opacity="0.85" />
        <ellipse cx="22" cy="14" rx="3" ry="6.6" fill="currentColor" opacity="0.7" transform="rotate(26 22 14)" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 34" className={className} style={style} aria-hidden="true">
      <path
        d="M12 1 C 18.8 7.2, 21.6 14, 19.6 20.6 C 18.2 25.2, 14.8 30.4, 12 32.8 C 9.2 30.4, 5.8 25.2, 4.4 20.6 C 2.4 14, 5.2 7.2, 12 1 Z"
        fill="currentColor"
      />
      <path d="M12 4.5 L12 29.5" stroke="rgba(255,253,247,0.5)" strokeWidth="0.8" />
    </svg>
  );
}
