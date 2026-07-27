import React, { useState, useCallback, useRef, useEffect } from "react";
import { WEDDING_CONFIG } from "@/config/dates";
import { useActiveSection } from "../hooks/useActiveSection";
import { useScrollProgress } from "../hooks/useScrollProgress";
import { Navigation } from "../components/layout/Navigation";
import { MusicPlayerV2 } from "../components/layout/MusicPlayerV2";
import { OpeningExperience } from "../components/sections/OpeningExperience";
import { HeroSection } from "../components/sections/HeroSection";
import { InvitationSection } from "../components/sections/InvitationSection";
import { OurStorySection } from "../components/sections/OurStorySection";
import { SpecialMomentsSection } from "../components/sections/SpecialMomentsSection";
import { WeddingDetailsSection } from "../components/sections/WeddingDetailsSection";
import { GallerySection } from "../components/sections/GallerySection";
import { CountdownSection } from "../components/sections/CountdownSection";
import { RSVPSection } from "../components/sections/RSVPSection";
import { ThankYouSection } from "../components/sections/ThankYouSection";
import { ArrowUp } from "lucide-react";

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
  const [openingComplete, setOpeningComplete] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const activeSection = useActiveSection(SECTION_IDS);
  const { progress } = useScrollProgress();
  const forcePlayRef = useRef<(() => void) | null>(null);

  const handleNavigate = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

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

      {/* Opening Experience */}
      {!openingComplete && (
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
        <HeroSection onEnter={() => handleNavigate("invitation")} />
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
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
      >
        <ArrowUp size={18} />
      </button>
    </div>
  );
};

export default WeddingV2;
