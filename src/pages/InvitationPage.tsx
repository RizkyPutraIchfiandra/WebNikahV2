import { AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";

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

/** Rangkaian utama undangan: pembuka → hero → … → penutup. */
export default function InvitationPage() {
  const [opened, setOpened] = useState(false);

  const guestName = useMemo(() => {
    const raw = new URLSearchParams(window.location.search).get("to") ?? "";
    const cleaned = raw.replace(/\+/g, " ").replace(/\s+/g, " ").trim();
    return cleaned.slice(0, 80) || weddingConfig.guest.guestName;
  }, []);

  useBodyLock(!opened);

  const handleOpen = () => {
    window.scrollTo({ top: 0, behavior: "auto" });
    setOpened(true);
  };

  return (
    <ToastProvider>
      <Preloader />

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
        <MusicPlayer started={opened} />
      </div>
    </ToastProvider>
  );
}
