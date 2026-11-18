import React, { useState, useCallback, useRef, useEffect } from "react";
import type Lenis from "lenis";
import { WEDDING_CONFIG, isPostWedding } from "@/config/dates";
import { useScrolledPast } from "../hooks/useScrolledPast";
import { Navigation } from "../components/layout/Navigation";
import { ScrollProgressBar } from "../components/layout/ScrollProgressBar";
import { MusicPlayerV2 } from "../components/layout/MusicPlayerV2";
import { OpeningExperience } from "../components/sections/OpeningExperience";
import { HeroSection } from "../components/sections/HeroSection";
import { PostWeddingHero } from "../components/sections/PostWeddingHero";
import { InvitationSection } from "../components/sections/InvitationSection";
import { OurStorySection } from "../components/sections/OurStorySection";
import { WeddingDetailsSection } from "../components/sections/WeddingDetailsSection";
import { GallerySection } from "../components/sections/GallerySection";
import { CountdownSection } from "../components/sections/CountdownSection";
import { RSVPSection } from "../components/sections/RSVPSection";
import { ThankYouSection } from "../components/sections/ThankYouSection";
import { ArrowUp } from "lucide-react";
import { useSmoothScroll } from "../hooks/useSmoothScroll";
// Styles travel with the page now that it is lazily routed at /v2
import "../styles/v2.css";

const NAV_ITEMS = [
  { id: "hero", label: "Home" },
  { id: "invitation", label: "Invitation" },
  { id: "story", label: "Story" },
  { id: "details", label: "Details" },
  { id: "gallery", label: "Gallery" },
  { id: "countdown", label: "Countdown" },
  { id: "rsvp", label: "RSVP" },
];

/** Back-to-top button — owns its own scroll threshold so the page doesn't re-render. */
const BackToTop: React.FC<{ lenisRef: React.MutableRefObject<Lenis | null> }> = ({ lenisRef }) => {
  const visible = useScrolledPast(600);
  return (
    <button
      className={`v2-back-to-top ${visible ? "visible" : ""}`}
      onClick={() => {
        if (lenisRef.current) {
          lenisRef.current.scrollTo(0);
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }}
      aria-label="Back to top"
    >
      <ArrowUp size={18} />
    </button>
  );
};

/**
 * Wedding V2 — Main page composing all sections.
 * Storytelling flow: Opening → Hero → Invitation → Story → Details → Gallery → Countdown → RSVP → Thank You
 *
 * Perf rule: no scroll-position state at this level. Anything that reacts to
 * scrolling (progress bar, back-to-top, nav highlight, music-player reveal)
 * owns that state itself, so scrolling never re-renders every section.
 */
const WeddingV2: React.FC = () => {
  const lenisRef = useSmoothScroll();
  // Once the wedding has passed the envelope intro is skipped entirely and
  // the hero becomes the looping thank-you video.
  const [postWedding] = useState(isPostWedding);
  const [openingComplete, setOpeningComplete] = useState(postWedding);
  // Flips slightly before openingComplete — when the intro's light bloom
  // peaks — so the hero's entrance plays as the intro dissolves.
  const [heroPlay, setHeroPlay] = useState(postWedding);
  const forcePlayRef = useRef<(() => void) | null>(null);

  const handleNavigate = useCallback(
    (id: string) => {
      const el = document.getElementById(id);
      if (!el) return;
      if (lenisRef.current) {
        lenisRef.current.scrollTo(el, { offset: 0 });
      } else {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },
    [lenisRef],
  );

  const handleOpeningComplete = useCallback(() => {
    setOpeningComplete(true);
  }, []);

  const handleOpeningReveal = useCallback(() => {
    setHeroPlay(true);
  }, []);

  const handleOpeningStart = useCallback(() => {
    forcePlayRef.current?.();
  }, []);

  // Set document title
  useEffect(() => {
    document.title = `${WEDDING_CONFIG.couple.displayNames} · ${WEDDING_CONFIG.couple.tagline}`;
  }, []);

  return (
    <div className="v2-root">
      <ScrollProgressBar />

      {/* Opening Experience — never shown once the wedding is over */}
      {!postWedding && !openingComplete && (
        <OpeningExperience
          onComplete={handleOpeningComplete}
          onStart={handleOpeningStart}
          onReveal={handleOpeningReveal}
        />
      )}

      {/* Navigation */}
      {openingComplete && (
        <Navigation
          items={NAV_ITEMS}
          onNavigate={handleNavigate}
        />
      )}

      {/* Sections */}
      <main>
        {postWedding ? (
          <PostWeddingHero onEnter={() => handleNavigate("invitation")} />
        ) : (
          <HeroSection play={heroPlay || openingComplete} onEnter={() => handleNavigate("invitation")} />
        )}
        <InvitationSection />
        <OurStorySection onNavigate={handleNavigate} />
        <WeddingDetailsSection />
        <GallerySection />
        <CountdownSection />
        <RSVPSection />
        <ThankYouSection />
      </main>

      {/* Music Player — always rendered so forcePlayRef is available during opening */}
      <MusicPlayerV2
        autoPlay={openingComplete && WEDDING_CONFIG.features.autoPlayMusic}
        forcePlayRef={forcePlayRef}
      />

      <BackToTop lenisRef={lenisRef} />
    </div>
  );
};

export default WeddingV2;
