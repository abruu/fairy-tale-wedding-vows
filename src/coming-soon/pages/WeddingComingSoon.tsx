import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { comingSoonConfig } from "../config";
import { useScrollLock } from "../hooks/useScrollLock";
import { useDeviceProfile } from "../hooks/useDeviceProfile";
import { useParallax } from "../hooks/useParallax";
import { WeddingBackground } from "../components/WeddingBackground";
import { DecorativeFrame } from "../components/DecorativeFrame";
import { CursorMagic } from "../components/CursorMagic";
import { WeddingHero } from "../components/WeddingHero";
import { MusicPlayer } from "../components/MusicPlayer";
import { EntryVeil } from "../components/EntryVeil";
import { song } from "../audio/song";
import "../styles/coming-soon.css";

/** The game is only needed once the visitor asks for it. */
const CoupleQuiz = lazy(() =>
  import("../components/CoupleQuiz").then((m) => ({ default: m.CoupleQuiz })),
);

/**
 * Abrin & Elsa — one-screen "coming soon" experience.
 * No page scrolling: everything scales to fit a single 100dvh viewport.
 */
export const WeddingComingSoon = () => {
  const [gameOpen, setGameOpen] = useState(false);
  /** The opening gate doubles as the gesture that lets the song play */
  const [entered, setEntered] = useState(!comingSoonConfig.music.entryGate);
  const rootRef = useRef<HTMLDivElement>(null);
  const { calm, light, magic } = useDeviceProfile();

  useScrollLock();
  useParallax(rootRef, !calm);

  // One shared audio element for the whole page
  useEffect(() => () => song.dispose(), []);

  return (
    <div className="cs-root" ref={rootRef}>
      <WeddingBackground calm={calm} light={light} />
      <DecorativeFrame />
      {entered && (
        <>
          <WeddingHero onOpenGame={() => setGameOpen(true)} />
          <MusicPlayer />
          <CursorMagic enabled={magic} />
        </>
      )}

      {!entered && <EntryVeil onEnter={() => setEntered(true)} />}

      {gameOpen && (
        <Suspense fallback={null}>
          <CoupleQuiz onClose={() => setGameOpen(false)} />
        </Suspense>
      )}

      {/* Plain-text fallback for crawlers and screen readers */}
      <span className="sr-only">
        {comingSoonConfig.groom} and {comingSoonConfig.bride} are getting married
        on {comingSoonConfig.displayDate}. {comingSoonConfig.copy.comingSoon}
      </span>
    </div>
  );
};

export default WeddingComingSoon;
