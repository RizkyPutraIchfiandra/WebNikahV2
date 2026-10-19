import { AnimatePresence } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import { Closing } from "@/components/closing/Closing";
import { Preloader } from "@/components/common/Preloader";
import { ToastProvider } from "@/components/common/Toast";
import { Countdown } from "@/components/countdown/Countdown";
import { Couple } from "@/components/couple/Couple";
import { EventDetails } from "@/components/event/EventDetails";
import { Gallery } from "@/components/gallery/Gallery";
import { Gift } from "@/components/gift/Gift";
import { Hero } from "@/components/hero/Hero";
import { MusicPlayer } from "@/components/music/MusicPlayer";
import { Navigation } from "@/components/nav/Navigation";
import { OpeningScreen } from "@/components/opening/OpeningScreen";
import { FallingLeaves } from "@/components/ornaments/FallingLeaves";
import { Quote } from "@/components/quote/Quote";
import { RSVP } from "@/components/rsvp/RSVP";
import { LoveStory } from "@/components/story/LoveStory";
import { weddingConfig } from "@/data/weddingConfig";
import { useBodyLock } from "@/hooks";
import { guestNameFromSlug } from "@/lib/guestLink";
import { startMusicPlayback } from "@/lib/music";

/** Rangkaian utama undangan: pembuka → hero → … → penutup. */
export default function InvitationPage() {
  const [opened, setOpened] = useState(false);
  const { slug } = useParams();
  const audioRef = useRef<HTMLAudioElement>(null);

  const guestName = useMemo(() => {
    const raw = new URLSearchParams(window.location.search).get("to") ?? "";
    const cleaned = raw.replace(/\+/g, " ").replace(/\s+/g, " ").trim();
    if (cleaned) return cleaned.slice(0, 80);
    const fromSlug = guestNameFromSlug(slug ?? "").trim();
    return fromSlug.slice(0, 80) || weddingConfig.guest.guestName;
  }, [slug]);

  useBodyLock(!opened);

  const handleOpen = () => {
    window.scrollTo({ top: 0, behavior: "auto" });
    // play() dipanggil langsung di dalam gestur klik (bukan lewat efek):
    // hanya begitu cara yang andal di iOS Safari & peramban dalam
    // aplikasi seperti WhatsApp — mencegah musik "kadang nyala".
    const audio = audioRef.current;
    if (audio) startMusicPlayback(audio);
    setOpened(true);
  };

  return (
    <ToastProvider>
      <Preloader />

      {/* Dipasang sejak awal agar berkas musik ter-buffer (preload="auto")
          dan menyala seketika saat "Buka Undangan" diklik. */}
      <audio
        ref={audioRef}
        src={weddingConfig.media.musicUrl}
        loop
        preload="auto"
        aria-hidden="true"
      />

      <AnimatePresence>
        {!opened && (
          <OpeningScreen key="opening" guestName={guestName} onOpen={handleOpen} />
        )}
      </AnimatePresence>

      <div
        aria-hidden={!opened}
        inert={!opened}
        className={opened ? undefined : "pointer-events-none"}
      >
        <FallingLeaves tone="light" />

        <main>
          <Hero started={opened} />
          <Countdown />
          <Quote />
          <Couple />
          <LoveStory />
          <EventDetails />
          <Gallery />
          <Gift />
          <RSVP guestName={guestName} />
          <Closing />
        </main>

        <Navigation />
        <MusicPlayer started={opened} audioRef={audioRef} />
      </div>
    </ToastProvider>
  );
}
