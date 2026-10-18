import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  Music2,
  Pause,
  Play,
  Repeat,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";

import { EASE } from "@/components/common/Reveal";
import { EucalyptusGeom } from "@/components/ornaments/ornaments";
import { weddingConfig } from "@/data/weddingConfig";
import { useLanguage } from "@/lib/i18n";

/** Sampul album kustom — emerald, emas, monogram. */
function AlbumArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 240" className={className} aria-hidden="true">
      <rect width="240" height="240" rx="14" fill="#0d291e" />
      <circle cx="120" cy="120" r="104" fill="none" stroke="#d4af37" strokeWidth="1" opacity="0.45" />
      <circle cx="120" cy="120" r="96" fill="none" stroke="#d4af37" strokeWidth="0.6" opacity="0.3" />
      <svg x="0" y="148" width="84" height="100" viewBox="0 0 120 240" className="text-gold">
        <g transform="rotate(-52 60 224)">
          <EucalyptusGeom leaves={6} opacity={0.6} />
        </g>
      </svg>
      <svg x="156" y="148" width="84" height="100" viewBox="0 0 120 240" className="text-gold">
        <g transform="rotate(52 60 224)">
          <EucalyptusGeom leaves={6} opacity={0.6} />
        </g>
      </svg>
      <text
        x="120"
        y="112"
        textAnchor="middle"
        fontSize="46"
        fill="#f7eedb"
        style={{ fontFamily: "var(--font-display)" }}
      >
        D &amp; I
      </text>
      <text
        x="120"
        y="142"
        textAnchor="middle"
        fontSize="10.5"
        letterSpacing="4"
        fill="#d4af37"
        style={{ fontFamily: "var(--font-body)" }}
      >
        06 · 12 · 2026
      </text>
    </svg>
  );
}

function Equalizer() {
  return (
    <span className="flex h-3 items-end gap-[3px]" aria-hidden="true">
      {[0, 1, 2].map((index) => (
        <span
          key={index}
          className="eq-bar w-[3px] rounded-sm bg-gold"
          style={{ animationDelay: `${index * 0.18}s` }}
        />
      ))}
    </span>
  );
}

/**
 * Pemutar musik gaya kartu: piringan vinyl saat mengecil, membuka menjadi
 * kartu ala Spotify dengan sampul, progres, dan kontrol volume.
 */
export function MusicPlayer({ started }: { started: boolean }) {
  const { t } = useLanguage();
  const { media } = weddingConfig;
  const audioRef = useRef<HTMLAudioElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);

  /* Mulai musik saat undangan dibuka, dengan volume naik perlahan. */
  useEffect(() => {
    if (!started) return;
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0;
    audio
      .play()
      .then(() => {
        setPlaying(true);
        const begin = performance.now();
        const fadeMs = 1600;
        const fade = (now: number) => {
          const ratio = Math.min(1, (now - begin) / fadeMs);
          audio.volume = 0.9 * ratio;
          if (ratio < 1 && !audio.paused) requestAnimationFrame(fade);
        };
        requestAnimationFrame(fade);
      })
      .catch(() => setPlaying(false));
  }, [started]);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      if (audio.volume < 0.2) audio.volume = 0.9;
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    } else {
      audio.pause();
      setPlaying(false);
    }
  }, []);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const next = !muted;
    audio.muted = next;
    setMuted(next);
  }, [muted]);

  const seek = (value: number) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    audio.currentTime = (value / 100) * duration;
    setCurrent(audio.currentTime);
  };

  const progress = duration > 0 ? (current / duration) * 100 : 0;
  const format = (seconds: number) =>
    `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;

  if (!started) return null;

  return (
    <>
      <audio
        ref={audioRef}
        src={media.musicUrl}
        loop
        preload="metadata"
        onTimeUpdate={(event) => setCurrent(event.currentTarget.currentTime)}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration || 0)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />

      <AnimatePresence mode="wait">
        {expanded ? (
          <motion.div
            key="card"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.45, ease: EASE }}
            role="region"
            aria-label={t.music.title}
            className="fixed bottom-24 right-4 z-40 w-[21rem] max-w-[calc(100vw-2rem)] rounded-2xl border border-gold/30 bg-night/95 p-4 text-cream shadow-[0_24px_60px_rgba(8,29,21,0.5)] backdrop-blur-sm lg:bottom-6 lg:right-6"
          >
            <div className="flex items-center gap-3.5">
              <AlbumArt className="h-16 w-16 shrink-0 rounded-xl border border-gold/40" />
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.3em] text-gold">
                  {playing ? <Equalizer /> : <Music2 className="h-3.5 w-3.5" />}
                  {t.music.nowPlaying}
                </p>
                <p className="mt-1.5 truncate font-display text-xl leading-tight text-cream">
                  {media.musicTitle}
                </p>
                <p className="truncate text-[11px] text-sage-light">
                  {media.musicArtist}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setExpanded(false)}
                aria-label={t.music.close}
                className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-full border border-gold/25 text-sage-light transition-colors hover:border-gold/60 hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4">
              <input
                type="range"
                min={0}
                max={100}
                step={0.1}
                value={progress}
                onChange={(event) => seek(Number(event.target.value))}
                aria-label={t.music.title}
                className="player-range w-full"
                style={{ "--progress": `${progress}%` } as CSSProperties}
              />
              <div className="mt-1.5 flex items-center justify-between text-[10px] tracking-widest text-sage-light">
                <span>{format(current)}</span>
                <span>{format(duration)}</span>
              </div>
            </div>

            <div className="mt-2 flex items-center justify-between px-2">
              <button
                type="button"
                onClick={toggleMute}
                aria-label={muted ? t.music.unmute : t.music.mute}
                className="grid h-10 w-10 cursor-pointer place-items-center rounded-full text-sage-light transition-colors hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              >
                {muted ? <VolumeX className="h-[18px] w-[18px]" /> : <Volume2 className="h-[18px] w-[18px]" />}
              </button>

              <button
                type="button"
                onClick={toggle}
                aria-label={playing ? t.music.pause : t.music.play}
                className="grid h-12 w-12 cursor-pointer place-items-center rounded-full bg-gold text-night shadow-[0_10px_24px_rgba(212,175,55,0.35)] transition-transform duration-300 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              >
                {playing ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="ml-0.5 h-5 w-5" />
                )}
              </button>

              <span
                className="grid h-10 w-10 place-items-center text-sage-light/60"
                title="Loop"
                aria-hidden="true"
              >
                <Repeat className="h-4 w-4" />
              </span>
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="vinyl"
            type="button"
            onClick={() => setExpanded(true)}
            aria-label={t.music.open}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="fixed bottom-24 right-4 z-40 grid h-14 w-14 cursor-pointer place-items-center rounded-full border border-gold/50 bg-night/90 shadow-[0_14px_36px_rgba(8,29,21,0.4)] backdrop-blur-sm lg:bottom-6 lg:right-6"
          >
            {playing && (
              <span
                aria-hidden="true"
                className="absolute inset-0 animate-pulse-soft rounded-full border border-gold/50"
              />
            )}
            <span
              className={`relative grid h-10 w-10 place-items-center rounded-full bg-[radial-gradient(circle_at_center,#16402f,#081d15)] ${
                playing ? "animate-spin-slow" : ""
              }`}
            >
              <span aria-hidden="true" className="absolute inset-0 rounded-full border border-gold/25" />
              <span aria-hidden="true" className="absolute inset-[7px] rounded-full border border-gold/20" />
              <span aria-hidden="true" className="h-3 w-3 rounded-full bg-gold" />
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
