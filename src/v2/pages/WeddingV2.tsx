import React, { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useActiveSection } from "../hooks/useActiveSection";
import { useSmoothScroll } from "../hooks/useSmoothScroll";
import { useParallax } from "../hooks/useParallax";
import { useBackgroundMusic } from "../hooks/useBackgroundMusic";
import { LanguageProvider, useLang } from "../lib/i18n";
import { Navigation, type NavItem } from "../components/layout/Navigation";
import { MusicPlayerV2 } from "../components/layout/MusicPlayerV2";
import { SectionDivider } from "../components/shared/SectionDivider";
import { OpeningExperience } from "../components/sections/OpeningExperience";
import { HeroSection } from "../components/sections/HeroSection";
import { StorySection } from "../components/sections/StorySection";
import { CoupleSection } from "../components/sections/CoupleSection";
import { EventsSection } from "../components/sections/EventsSection";
import { MuhurthamSection } from "../components/sections/MuhurthamSection";
import { GallerySection } from "../components/sections/GallerySection";
import { RSVPSection } from "../components/sections/RSVPSection";
import { FooterSection } from "../components/sections/FooterSection";
import "../styles/v2.css";

const NAV_ITEMS: NavItem[] = [
  { id: "story", label: "nav.story" },
  { id: "couple", label: "nav.couple" },
  { id: "events", label: "nav.events" },
  { id: "gallery", label: "nav.gallery" },
  { id: "rsvp", label: "nav.rsvp" },
];

// Every section the nav should react to — the hero and the Muhurtham band have no link of their own.
const SECTION_IDS = ["home", "story", "couple", "events", "muhurtham", "gallery", "rsvp"];

/**
 * The wedding site (the home page, "/"). Opening screen → Hero → Our Story →
 * Bride & Groom → Events → Muhurtham → Gallery →
 * Live stream + RSVP → Footer, with a thin diamond rule between bands.
 */
const WeddingPage: React.FC = () => {
  const lenisRef = useSmoothScroll();
  const rootRef = useRef<HTMLDivElement>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  // Optional music — off until the visitor presses the music button.
  const music = useBackgroundMusic();
  // The opening screen shows once per visit, over the already-mounted page.
  // Reduced-motion visitors skip it entirely.
  const [introDone, setIntroDone] = useState(
    () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false,
  );
  // Flips as the opening panels start to part, so the hero names animate in
  // while they're being uncovered rather than after the overlay is gone.
  const [heroReady, setHeroReady] = useState(introDone);
  const handleIntroOpening = useCallback(() => setHeroReady(true), []);
  const handleIntroComplete = useCallback(() => {
    // Always open on the hero: Lenis keeps its own scroll target, so reset it too
    lenisRef.current?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
    setHeroReady(true);
    setIntroDone(true);
  }, [lenisRef]);

  // Phones restore the previous scroll position on reload, which would drop a
  // returning visitor mid-page behind the intro.
  useEffect(() => {
    const prev = history.scrollRestoration;
    history.scrollRestoration = "manual";
    return () => {
      history.scrollRestoration = prev;
    };
  }, []);
  const activeSection = useActiveSection(SECTION_IDS);
  const { t } = useLang();
  useParallax(rootRef);

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

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="v2-root" ref={rootRef}>
      <a className="v2-skip-link" href="#main-content">
        {t("a11y.skip")}
      </a>

      {!introDone && <OpeningExperience onOpening={handleIntroOpening} onComplete={handleIntroComplete} />}

      {introDone && <Navigation items={NAV_ITEMS} activeSection={activeSection} onNavigate={handleNavigate} onHome={() => handleNavigate("home")} />}

      <main id="main-content" tabIndex={-1}>
        <HeroSection ready={heroReady} onEnter={() => handleNavigate("story")} />
        <SectionDivider />
        <StorySection />
        <SectionDivider />
        <CoupleSection />
        <SectionDivider />
        <EventsSection />
        <SectionDivider />
        <MuhurthamSection />
        <SectionDivider />
        <GallerySection />
        <SectionDivider />
        <RSVPSection />
      </main>

      <FooterSection />

      {introDone && <MusicPlayerV2 music={music} />}

      <button
        type="button"
        className={`v2-fab v2-back-to-top ${showBackToTop ? "visible" : ""}`}
        onClick={() => {
          if (lenisRef.current) {
            lenisRef.current.scrollTo(0);
          } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }}
        aria-label={t("a11y.backToTop")}
        tabIndex={showBackToTop ? 0 : -1}
      >
        <ArrowUp size={18} />
      </button>
    </div>
  );
};

const WeddingV2: React.FC = () => (
  <LanguageProvider>
    <WeddingPage />
  </LanguageProvider>
);

export default WeddingV2;
