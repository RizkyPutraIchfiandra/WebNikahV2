/**
 * Kendali pemutaran musik undangan.
 *
 * Aturan emas autoplay: `audio.play()` WAJIB dipanggil langsung di dalam
 * gestur pengguna (klik "Buka Undangan") — bukan dari efek susulan.
 * iOS Safari dan peramban dalam aplikasi (WhatsApp/Instagram) kerap
 * memblokir play() yang tidak berada di rantai gestur: gejalanya musik
 * "kadang nyala, kadang tidak".
 */

/** Volume akhir pemutaran (0–1). */
export const MUSIC_TARGET_VOLUME = 0.9;

/** Durasi fade-in saat musik mulai (ms). */
const FADE_MS = 1600;

/** Nyalakan musik + naikkan volume perlahan 0 → MUSIC_TARGET_VOLUME. */
export function startMusicPlayback(audio: HTMLAudioElement) {
  // iOS mengabaikan preload sebelum ada gestur — mulai muat dari sini.
  if (audio.readyState === HTMLMediaElement.HAVE_NOTHING) audio.load();

  audio.volume = 0;

  const playback = audio.play();

  // Bila play() diblokir: kembalikan volume penuh supaya pemutaran
  // manual dari tombol pemutar tetap terdengar tanpa fade macet.
  const ensureAudible = () => {
    audio.volume = MUSIC_TARGET_VOLUME;
  };

  if (playback && typeof playback.then === "function") {
    playback.then(() => fadeIn(audio)).catch(ensureAudible);
  } else {
    fadeIn(audio);
  }
}

function fadeIn(audio: HTMLAudioElement) {
  const begin = performance.now();

  const step = (now: number) => {
    if (audio.paused) return;
    const ratio = Math.min(1, (now - begin) / FADE_MS);
    audio.volume = MUSIC_TARGET_VOLUME * ratio;
    if (ratio < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);

  // Pengaman: rAF berhenti saat tab di latar belakang — pastikan volume
  // tetap sampai penuh meskipun animasi fade tidak sempat selesai.
  window.setTimeout(() => {
    if (!audio.paused && audio.volume < MUSIC_TARGET_VOLUME) {
      audio.volume = MUSIC_TARGET_VOLUME;
    }
  }, FADE_MS + 400);
}
