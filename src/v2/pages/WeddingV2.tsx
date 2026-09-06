import React, { useState, useCallback, useRef, useEffect } from "react";
import { WEDDING_CONFIG, isPostWedding } from "@/config/dates";
import { useActiveSection } from "../hooks/useActiveSection";
import { useScrollProgress } from "../hooks/useScrollProgress";
import { Navigation } from "../components/layout/Navigation";
import { MusicPlayerV2 } from "../components/layout/MusicPlayerV2";
import { OpeningExperience } from "../components/sections/OpeningExperience";
import { HeroSection } from "../components/sections/HeroSection";
import { PostWeddingHero } from "../components/sections/PostWeddingHero";
import { InvitationSection } from "../components/sections/InvitationSection";
import { OurStorySection } from "../components/sections/OurStorySection";
import { SpecialMomentsSection } from "../components/sections/SpecialMomentsSection";
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
  { id: "moments", label: "Moments" },
  { id: "details", label: "Details" },
  { id: "gallery", label: "Gallery" },
  { id: "countdown", label: "Countdown" },
  { id: "rsvp", label: "RSVP" },
];

const SECTION_IDS = NAV_ITEMS.map((n) => n.id);

/**
 * Wedding V2 — Main page composing all sections.
 * Storytelling flow: Opening → Hero → Invitation → Story → Moments → Details → Gallery → Countdown → RSVP → Thank You
 */
const WeddingV2: React.FC = () => {
  const lenisRef = useSmoothScroll();
  // Once the wedding has passed the envelope intro is skipped entirely and
  // the hero becomes the looping thank-you video.
  const [postWedding] = useState(isPostWedding);
  const [openingComplete, setOpeningComplete] = useState(postWedding);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const activeSection = useActiveSection(SECTION_IDS);
  const { progress } = useScrollProgress();
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

  const handleOpeningStart = useCallback(() => {
    forcePlayRef.current?.();
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setShowBackToTop(window.scrollY > 600);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Set document title
  useEffect(() => {
    document.title = `${WEDDING_CONFIG.couple.displayNames} · Wedding Invitation`;
  }, []);

  return (
    <div className="v2-root">
      {/* Scroll progress bar */}
      <div className="v2-scroll-progress" style={{ width: `${progress}%` }} />

      {/* Opening Experience — never shown once the wedding is over */}
      {!postWedding && !openingComplete && (
        <OpeningExperience
          onComplete={handleOpeningComplete}
          onStart={handleOpeningStart}
        />
      )}

      {/* Navigation */}
      {openingComplete && (
        <Navigation
          items={NAV_ITEMS}
          activeSection={activeSection}
          onNavigate={handleNavigate}
        />
      )}

      {/* Sections */}
      <main>
        {postWedding ? (
          <PostWeddingHero onEnter={() => handleNavigate("invitation")} />
        ) : (
          <HeroSection onEnter={() => handleNavigate("invitation")} />
        )}
        <InvitationSection />
        <OurStorySection />
        <SpecialMomentsSection />
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

      {/* Back to Top */}
      <button
        className={`v2-back-to-top ${showBackToTop ? "visible" : ""}`}
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
    </div>
  );
};

export default WeddingV2;
