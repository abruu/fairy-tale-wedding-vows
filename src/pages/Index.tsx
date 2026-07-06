import React, { useState, useEffect, useRef } from "react";
import {
  Heart,
  Calendar,
  Clock,
  MapPin,
  ChevronUp,
  Sparkles,
  Camera,
} from "lucide-react";
import PhotoGallery from "@/components/PhotoGallery";
import MusicPlayer from "@/components/MusicPlayer";
import VideoIntro from "@/components/VideoIntro";
import CountdownTimer from "@/components/CountdownTimer";
import OurStory from "@/components/OurStory";
import FloatingPetals from "@/components/FloatingPetals";
import FloatingDecorations from "@/components/FloatingDecorations";
import RSVPSection from "@/components/RSVPSection";
import BirthdayFireworks from "@/components/BirthdayFireworks";
import HeaderCountdown from "@/components/HeaderCountdown";
import AOS from "aos";
import "aos/dist/aos.css";
import { WEDDING_CONFIG } from "@/config/dates";
import { ANIMATION_CONFIG } from "@/config/animations";
import { useParallax } from "@/hooks/useParallax";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useSectionParallax } from "@/hooks/useSectionParallax";

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [showFireworks, setShowFireworks] = useState(
    WEDDING_CONFIG.features.showFireworks,
  );
  const [showVideo, setShowVideo] = useState(WEDDING_CONFIG.features.showVideo);
  const [engagementComplete, setEngagementComplete] = useState(false);
  const [weddingComplete, setWeddingComplete] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const forcePlayMusicRef = useRef<(() => void) | null>(null);

  // Parallax hook for hero background
  const { offsets: parallaxOffsets, disabled: parallaxDisabled } =
    useParallax();

  // Section parallax hooks
  const { ref: storyParallaxRef, layerStyle: storyLayerStyle } =
    useSectionParallax();
  const { ref: eventsParallaxRef, layerStyle: eventsLayerStyle } =
    useSectionParallax();
  const { ref: galleryParallaxRef, layerStyle: galleryLayerStyle } =
    useSectionParallax();

  // Scroll reveal hooks for sections
  const { ref: scriptureBannerRef, style: scriptureBannerStyle } =
    useScrollReveal<HTMLElement>({ animation: "fade-up" });
  const { ref: invitationRef, style: invitationStyle } =
    useScrollReveal<HTMLElement>({ animation: "fade-up", delay: 100 });
  const { ref: storyHeaderRef, style: storyHeaderStyle } =
    useScrollReveal<HTMLDivElement>({ animation: "fade-up" });
  const { ref: eventsHeaderRef, style: eventsHeaderStyle } =
    useScrollReveal<HTMLDivElement>({ animation: "fade-up" });
  const { ref: galleryHeaderRef, style: galleryHeaderStyle } =
    useScrollReveal<HTMLDivElement>({ animation: "fade-up" });
  const { ref: footerRef, style: footerStyle } =
    useScrollReveal<HTMLDivElement>({ animation: "fade-up" });

  const engagementDate = WEDDING_CONFIG.dates.engagement;
  const weddingDate = WEDDING_CONFIG.dates.wedding;

  // Check if engagement is complete
  useEffect(() => {
    const check = () => {
      const dayAfter = new Date(engagementDate);
      dayAfter.setDate(dayAfter.getDate() + 1);
      if (Date.now() > dayAfter.getTime()) setEngagementComplete(true);
    };
    check();
    const iv = setInterval(check, 60 * 60 * 1000);
    return () => clearInterval(iv);
  }, [engagementDate]);

  // Check if wedding is complete
  useEffect(() => {
    const check = () => {
      const weddingTime = new Date(weddingDate).getTime();
      const now = Date.now();
      console.log("Wedding check:", {
        weddingDate,
        weddingTime: new Date(weddingTime),
        now: new Date(now),
        isComplete: now > weddingTime,
        daysUntil: Math.floor((weddingTime - now) / (1000 * 60 * 60 * 24)),
      });
      if (now > weddingTime) {
        setWeddingComplete(true);
        setEngagementComplete(true);
      }
    };
    check();
    const iv = setInterval(check, 60 * 1000);
    return () => clearInterval(iv);
  }, [weddingDate]);

  // Scroll handler: music on first scroll, back-to-top button
  useEffect(() => {
    const onScroll = () => {
      if (!hasScrolled) {
        setHasScrolled(true);
        if (WEDDING_CONFIG.features.autoPlayMusic) setMusicEnabled(true);
      }
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [hasScrolled]);

  // AOS init
  useEffect(() => {
    AOS.init({
      duration: 750,
      once: true,
      easing: "ease-out-cubic",
      offset: 80,
    });
    const timer = setTimeout(() => {
      if (showFireworks) setShowFireworks(false);
    }, WEDDING_CONFIG.media.fireworks.duration);
    return () => clearTimeout(timer);
  }, [showFireworks]);

  const handleCountdownComplete = (type: "engagement" | "wedding") => {
    if (!WEDDING_CONFIG.features.countdownTriggers.enabled) return;
    if (type === "wedding") {
      setWeddingComplete(true);
      if (WEDDING_CONFIG.features.countdownTriggers.showFireworks) {
        setShowFireworks(true);
        setTimeout(
          () => setShowFireworks(false),
          WEDDING_CONFIG.features.countdownTriggers.fireworksDuration,
        );
      }
      if (WEDDING_CONFIG.features.countdownTriggers.showVideo)
        setShowVideo(true);
    }
  };

  const scrollToContent = () => {
    mainContentRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const galleryImages = WEDDING_CONFIG.gallery.images;

  const storyItems = WEDDING_CONFIG.story.items;

  const weddingDateFormatted = new Date(
    WEDDING_CONFIG.dates.wedding,
  ).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <VideoIntro
        onComplete={() => setIsLoaded(true)}
        onStart={() => {
          setMusicEnabled(true);
          forcePlayMusicRef.current?.();
        }}
      />
      {/* Music starts as soon as video is tapped — no need to wait for onComplete */}
      <MusicPlayer
        audioSrc={WEDDING_CONFIG.media.musicUrl}
        autoPlay={musicEnabled}
        forcePlayRef={forcePlayMusicRef}
      />

      {isLoaded && showFireworks && (
        <BirthdayFireworks
          duration={WEDDING_CONFIG.media.fireworks.duration}
          intensity={WEDDING_CONFIG.media.fireworks.intensity}
          autoStart
          startDelay={WEDDING_CONFIG.media.fireworks.startDelay}
        />
      )}

      {/* Sticky header countdown — shows wedding countdown after engagement,
          then "✨ United Forever ✨" after the wedding */}
      <HeaderCountdown
        targetDate={weddingDate}
        engagementComplete={engagementComplete}
        onWeddingComplete={() => handleCountdownComplete("wedding")}
      />

      <div
        className="min-h-screen overflow-x-hidden"
        style={{ background: "hsl(33 100% 97%)" }}
      >
        {/* ══════════ HERO ══════════ */}
        <section
          id="hero"
          className="relative min-h-screen flex items-center justify-center overflow-hidden"
        >
          {/* Background image with parallax */}
          <div
            className="absolute inset-0 z-0"
            style={
              !parallaxDisabled
                ? {
                    transform: `translate3d(0, ${parallaxOffsets.bg}px, 0) scale(1.08)`,
                    willChange: "transform",
                  }
                : undefined
            }
          >
            <img
              src={WEDDING_CONFIG.media.heroBgImage}
              alt={WEDDING_CONFIG.couple.displayNames}
              className="w-full h-full object-cover"
            />
            {/* Stronger overlay for text readability */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.52) 40%, rgba(0,0,0,0.75) 100%)",
              }}
            />
          </div>

          {/* Subtle floating petals (snowfall) */}
          <FloatingPetals count={6} />

          {/* Decorative corner frames (desktop only) */}
          <div className="absolute inset-0 pointer-events-none z-10 hidden md:block">
            {WEDDING_CONFIG.heroCornerFrames.map((frame, i) => (
              <div
                key={i}
                className={`absolute ${frame.position} ${frame.size} ${frame.animation}`}
              >
                <img
                  src={frame.src}
                  alt=""
                  aria-hidden="true"
                  className="w-full h-full object-cover rounded-xl"
                  style={{
                    boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
                    border: "2px solid rgba(168,201,230,0.6)",
                  }}
                />
              </div>
            ))}
          </div>

          {/* Hero content */}
          <div
            className="relative z-20 text-center px-6 w-full max-w-2xl mx-auto"
            style={
              !parallaxDisabled
                ? {
                    transform: `translate3d(0, ${-parallaxOffsets.fg * 0.4}px, 0)`,
                    willChange: "transform",
                  }
                : undefined
            }
          >
            {/* Eyebrow label */}
            <p
              className="text-xs uppercase tracking-[0.35em] mb-8 font-medium"
              style={{
                color: "rgba(168,201,230,0.9)",
                animation: "fade-in 0.8s ease-out 0.1s both",
              }}
            >
              {WEDDING_CONFIG.couple.tagline}
            </p>

            {/* Names */}
            <h1
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontStyle: "italic",
                fontSize: "clamp(3.2rem, 10vw, 7rem)",
                lineHeight: 1,
                color: "#ffffff",
                textShadow: "0 2px 30px rgba(0,0,0,0.7)",
                animation: "fade-up 0.9s ease-out 0.25s both",
                letterSpacing: "-0.01em",
              }}
            >
              {WEDDING_CONFIG.couple.name1}
              <span
                style={{
                  display: "block",
                  fontSize: "clamp(1rem, 3vw, 1.6rem)",
                  color: "rgba(168,201,230,0.9)",
                  letterSpacing: "0.15em",
                  margin: "0.3em 0",
                  fontStyle: "normal",
                  fontWeight: 300,
                }}
              >
                &amp;
              </span>
              {WEDDING_CONFIG.couple.name2}
            </h1>

            {/* Divider */}
            <div
              className="flex items-center justify-center gap-3 my-7"
              style={{ animation: "fade-in 0.7s ease-out 0.55s both" }}
            >
              <div
                style={{
                  height: "1px",
                  width: 48,
                  background: "rgba(168,201,230,0.5)",
                }}
              />
              <Heart size={13} fill="#A8C9E6" style={{ color: "#A8C9E6" }} />
              <div
                style={{
                  height: "1px",
                  width: 48,
                  background: "rgba(168,201,230,0.5)",
                }}
              />
            </div>

            {/* Subtext */}
            <p
              className="font-serif italic mb-3"
              style={{
                fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
                color: "rgba(255,255,255,0.9)",
                animation: "fade-up 0.8s ease-out 0.6s both",
                letterSpacing: "0.02em",
              }}
            >
              {WEDDING_CONFIG.couple.weddingMessage}
            </p>

            {/* Wedding date */}
            <p
              className="mb-10 font-medium"
              style={{
                fontSize: "clamp(0.85rem, 2vw, 1rem)",
                color: "#A8C9E6",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                animation: "fade-up 0.8s ease-out 0.7s both",
              }}
            >
              {weddingDateFormatted}
            </p>

            {/* Countdown / United Forever — frosted card, fully centered */}
            {!showVideo && (
              <div style={{ animation: "fade-up 0.9s ease-out 0.8s both" }}>
                <div
                  style={{
                    background: "rgba(0,0,0,0)",
                    backdropFilter: "blur(5px)",
                    WebkitBackdropFilter: "blur(18px)",
                    border: "1px solid rgba(168,201,230,0.3)",
                    borderRadius: "1.25rem",
                    padding: "1.5rem 1.5rem",
                    textAlign: "center",
                  }}
                >
                  {console.log("Hero render states:", {
                    engagementComplete,
                    weddingComplete,
                  })}
                  {!engagementComplete ? (
                    /* ── Engagement countdown (before engagement) ── */
                    <CountdownTimer
                      targetDate={engagementDate}
                      label={WEDDING_CONFIG.countdown.engagementLabel}
                      premium
                      onComplete={() => {
                        setEngagementComplete(true);
                        handleCountdownComplete("engagement");
                      }}
                    />
                  ) : !weddingComplete ? (
                    /* ── Wedding countdown (after engagement, before wedding) ── */
                    <CountdownTimer
                      targetDate={weddingDate}
                      label={WEDDING_CONFIG.countdown.weddingLabel}
                      premium
                      onComplete={() => handleCountdownComplete("wedding")}
                    />
                  ) : (
                    /* ── United Forever celebration (after wedding date) ── */
                    <div
                      className="flex flex-col items-center gap-4"
                      style={{
                        animation: "scale-in 0.8s ease-out both",
                      }}
                    >
                      {/* Top ornament */}
                      <div className="flex items-center justify-center gap-3">
                        <div
                          style={{
                            width: 50,
                            height: "1px",
                            background:
                              "linear-gradient(90deg, transparent, rgba(230,195,213,0.7))",
                          }}
                        />
                        <Sparkles
                          size={16}
                          className="animate-sparkle-twinkle"
                          style={{
                            color: "#E6C3D5",
                            filter:
                              "drop-shadow(0 0 8px rgba(230,195,213,0.8))",
                          }}
                        />
                        <div
                          style={{
                            width: 50,
                            height: "1px",
                            background:
                              "linear-gradient(90deg, rgba(230,195,213,0.7), transparent)",
                          }}
                        />
                      </div>

                      {/* United Forever — gradient shimmer */}
                      <p
                        className="font-serif italic"
                        style={{
                          fontSize: "clamp(1.8rem, 5vw, 2.8rem)",
                          letterSpacing: "0.1em",
                          margin: 0,
                          background:
                            "linear-gradient(90deg, #E6C3D5 0%, #A8C9E6 25%, #ffffff 50%, #A8C9E6 75%, #E6C3D5 100%)",
                          backgroundSize: "200% auto",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                          animation:
                            "united-shimmer 3s ease-in-out infinite, united-glow 2.5s ease-in-out infinite",
                        }}
                      >
                        United Forever
                      </p>

                      {/* Couple names with hearts */}
                      <div className="flex items-center justify-center gap-3">
                        <Heart
                          size={14}
                          fill="#E6C3D5"
                          style={{
                            color: "#E6C3D5",
                            animation: "heartbeat 2.2s ease-in-out infinite",
                          }}
                        />
                        <span
                          className="font-serif italic"
                          style={{
                            fontSize: "clamp(1rem, 3vw, 1.4rem)",
                            color: "rgba(255,255,255,0.95)",
                            letterSpacing: "0.08em",
                            textShadow: "0 2px 12px rgba(0,0,0,0.4)",
                          }}
                        >
                          Alex &amp; Mariyam
                        </span>
                        <Heart
                          size={14}
                          fill="#E6C3D5"
                          style={{
                            color: "#E6C3D5",
                            animation:
                              "heartbeat 2.2s ease-in-out infinite 1.1s",
                          }}
                        />
                      </div>

                      {/* Bottom ornament */}
                      <div className="flex items-center justify-center gap-3">
                        <div
                          style={{
                            width: 50,
                            height: "1px",
                            background:
                              "linear-gradient(90deg, transparent, rgba(168,201,230,0.7))",
                          }}
                        />
                        <Sparkles
                          size={16}
                          className="animate-sparkle-twinkle"
                          style={{
                            color: "#A8C9E6",
                            filter:
                              "drop-shadow(0 0 8px rgba(168,201,230,0.8))",
                            animationDelay: "1s",
                          }}
                        />
                        <div
                          style={{
                            width: 50,
                            height: "1px",
                            background:
                              "linear-gradient(90deg, rgba(168,201,230,0.7), transparent)",
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* CTA */}
            <button
              onClick={scrollToContent}
              className="btn-primary btn-primary-enhanced mt-8"
              style={{ animation: "fade-up 0.8s ease-out 1.1s both" }}
            >
              View Invitation ↓
            </button>
          </div>
        </section>

        {/* ══════════ SCRIPTURE BANNER ══════════ */}
        <section
          ref={scriptureBannerRef}
          className="py-14 px-4 bg-champagne-gradient relative overflow-hidden"
          style={scriptureBannerStyle}
        >
          {" "}
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 50%, #4A7FC1 0%, transparent 70%), radial-gradient(circle at 80% 50%, #A8C9E6 0%, transparent 70%)",
            }}
          />
          <div className="max-w-2xl mx-auto text-center relative">
            <p
              className="font-serif italic leading-relaxed"
              style={{
                fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)",
                color: "#7A4A4A",
              }}
            >
              {WEDDING_CONFIG.scripture.quote}
            </p>
            <p
              className="mt-3 text-xs uppercase tracking-widest"
              style={{ color: "#4A7FC1" }}
            >
              {WEDDING_CONFIG.scripture.reference}
            </p>
          </div>
        </section>

        {/* Main content ref */}
        <div ref={mainContentRef} />

        {/* ══════════ INVITATION ══════════ */}
        <section
          ref={invitationRef}
          id="invitation"
          className="invitation-section-bg py-20 px-4 relative overflow-hidden"
          style={invitationStyle}
        >
          {/* Decorative background glows */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
          >
            <div
              className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-30 -translate-x-1/2 -translate-y-1/2"
              style={{
                background:
                  "radial-gradient(circle, rgba(168,201,230,0.45) 0%, transparent 70%)",
              }}
            />
            <div
              className="absolute bottom-0 right-0 w-80 h-80 rounded-full opacity-25 translate-x-1/3 translate-y-1/3"
              style={{
                background:
                  "radial-gradient(circle, rgba(74,127,193,0.3) 0%, transparent 70%)",
              }}
            />
          </div>

          <div className="max-w-2xl mx-auto relative z-10">
            <div className="invitation-frame" data-aos="fade-up">
              {/* Corner flourishes */}
              <span
                className="invitation-corner invitation-corner-tl"
                aria-hidden="true"
              >
                ✦
              </span>
              <span
                className="invitation-corner invitation-corner-tr"
                aria-hidden="true"
              >
                ✦
              </span>
              <span
                className="invitation-corner invitation-corner-bl"
                aria-hidden="true"
              >
                ✦
              </span>
              <span
                className="invitation-corner invitation-corner-br"
                aria-hidden="true"
              >
                ✦
              </span>

              {/* Header emblem */}
              <div
                className="flex flex-col items-center mb-1"
                data-aos="fade-down"
                data-aos-delay="100"
              >
                <div className="invitation-crest">
                  <Heart
                    size={10}
                    fill="#4A7FC1"
                    style={{ color: "#4A7FC1" }}
                  />
                </div>
                <div className="invitation-ornament-line" />
                <p className="invitation-label">An Invitation From</p>
                <div className="invitation-ornament-line" />
              </div>

              {/* Two-family grid */}
              <div
                className="invitation-families"
                data-aos="fade-up"
                data-aos-delay="150"
              >
                <div className="invitation-family">
                  <p className="invitation-family-name">
                    {WEDDING_CONFIG.couple.groomParents}
                  </p>
                  <p className="invitation-family-address">
                    {WEDDING_CONFIG.couple.groomAddress}
                  </p>
                </div>
                <div className="invitation-family-connector" aria-hidden="true">
                  <div className="invitation-connector-line" />
                  <span className="invitation-connector-and">and</span>
                  <div className="invitation-connector-line" />
                </div>
                <div className="invitation-family">
                  <p className="invitation-family-name">
                    {WEDDING_CONFIG.couple.brideParents}
                  </p>
                  <p className="invitation-family-address">
                    {WEDDING_CONFIG.couple.brideAddress}
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="wedding-divider mx-auto my-6" />

              {/* Intro text */}
              <p
                className="invitation-intro-text"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                {WEDDING_CONFIG.couple.invitationIntro}
              </p>

              {/* Couple names */}
              <div
                className="invitation-names-block"
                data-aos="fade-up"
                data-aos-delay="250"
              >
                <div className="invitation-name-row">
                  <p className="invitation-name">
                    {WEDDING_CONFIG.couple.name1}
                  </p>
                  <p className="invitation-house">
                    {WEDDING_CONFIG.couple.groomHouseShort}
                  </p>
                </div>
                <div className="invitation-names-ampersand" aria-hidden="true">
                  <div className="invitation-amp-line" />
                  <span className="invitation-amp">&amp;</span>
                  <div className="invitation-amp-line" />
                </div>
                <div className="invitation-name-row">
                  <p className="invitation-name">
                    {WEDDING_CONFIG.couple.name2}
                  </p>
                  <p className="invitation-house">
                    {WEDDING_CONFIG.couple.brideHouseShort}
                  </p>
                </div>
              </div>

              {/* Bottom ornament line */}
              <div className="invitation-ornament-line mx-auto mt-2 mb-7" />

              {/* Joy badge */}
              <div
                className="flex justify-center"
                data-aos="fade-up"
                data-aos-delay="300"
              >
                <div className="invitation-joy-badge">
                  <Sparkles size={13} />
                  <span>Joyfully Invite You</span>
                  <Sparkles size={13} />
                </div>
              </div>

              {/* Sharing happiness */}
              <p
                className="invitation-sharing"
                data-aos="fade-up"
                data-aos-delay="350"
              >
                {WEDDING_CONFIG.couple.sharingHappiness}
              </p>
            </div>
          </div>
        </section>

        {/* ══════════ OUR STORY ══════════ */}
        <section
          id="our-story"
          ref={storyParallaxRef as React.RefObject<HTMLElement>}
          className="py-20 px-4 bg-rose-gradient relative overflow-hidden"
        >
          {/* Floating decorations */}
          <FloatingDecorations types={["leaves", "flowers"]} maxCount={8} />

          {/* Background decoration with parallax */}
          <div
            aria-hidden="true"
            className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-20 -translate-y-1/2 translate-x-1/2"
            style={{
              background: "radial-gradient(circle, #C5E0FF, transparent)",
              ...storyLayerStyle(ANIMATION_CONFIG.parallax.layers.background),
            }}
          />
          <div className="max-w-4xl mx-auto relative z-10">
            <div
              ref={storyHeaderRef}
              className="text-center mb-14"
              style={storyHeaderStyle}
            >
              <div className="inline-flex items-center gap-2 mb-4">
                <div
                  style={{
                    height: 1,
                    width: 36,
                    background: "rgba(74,127,193,0.4)",
                  }}
                />
                <Heart size={14} style={{ color: "#4A7FC1" }} />
                <div
                  style={{
                    height: 1,
                    width: 36,
                    background: "rgba(74,127,193,0.4)",
                  }}
                />
              </div>
              <h2 className="section-title mb-3">Our Story</h2>
              <div className="wedding-divider mx-auto" />
              <p className="section-subtitle mt-4 max-w-md mx-auto">
                Every great love story has a beginning. Here is ours.
              </p>
            </div>
            <OurStory items={storyItems} />
          </div>
        </section>

        {/* ══════════ EVENT DETAILS ══════════ */}
        <section
          id="events"
          ref={eventsParallaxRef as React.RefObject<HTMLElement>}
          className="py-20 px-4 relative overflow-hidden"
        >
          {/* Floating decorations */}
          <FloatingDecorations types={["sparkles"]} maxCount={6} />

          <div className="max-w-4xl mx-auto">
            <div
              ref={eventsHeaderRef}
              className="text-center mb-14"
              style={eventsHeaderStyle}
            >
              <div className="inline-flex items-center gap-2 mb-4">
                <div
                  style={{
                    height: 1,
                    width: 36,
                    background: "rgba(74,127,193,0.4)",
                  }}
                />
                <Calendar size={14} style={{ color: "#4A7FC1" }} />
                <div
                  style={{
                    height: 1,
                    width: 36,
                    background: "rgba(74,127,193,0.4)",
                  }}
                />
              </div>
              <h2 className="section-title mb-3">Event Details</h2>
              <div className="wedding-divider mx-auto" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Betrothal card */}
              <div
                className="wedding-card wedding-card-enhanced p-8"
                data-aos="fade-right"
                data-aos-delay="100"
                style={eventsLayerStyle(
                  ANIMATION_CONFIG.parallax.layers.foreground * 0.3,
                )}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(74,127,193,0.1)" }}
                  >
                    <Heart size={20} style={{ color: "#4A7FC1" }} />
                  </div>
                  <div>
                    <p
                      className="text-xs uppercase tracking-widest mb-0.5"
                      style={{ color: "#4A7FC1" }}
                    >
                      Engagement
                    </p>
                    <h3
                      className="font-serif text-xl"
                      style={{ color: "#4B3832" }}
                    >
                      Betrothal Ceremony
                    </h3>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar
                      size={16}
                      className="flex-shrink-0 mt-0.5"
                      style={{ color: "#4A7FC1" }}
                    />
                    <div>
                      <p
                        className="text-xs uppercase tracking-wide mb-0.5"
                        style={{ color: "#9D7070" }}
                      >
                        Date
                      </p>
                      <p
                        className="text-sm font-medium"
                        style={{ color: "#4B3832" }}
                      >
                        {WEDDING_CONFIG.events.betrothal.dateLabel}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock
                      size={16}
                      className="flex-shrink-0 mt-0.5"
                      style={{ color: "#4A7FC1" }}
                    />
                    <div>
                      <p
                        className="text-xs uppercase tracking-wide mb-0.5"
                        style={{ color: "#9D7070" }}
                      >
                        Time
                      </p>
                      <p
                        className="text-sm font-medium"
                        style={{ color: "#4B3832" }}
                      >
                        {WEDDING_CONFIG.events.betrothal.time}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin
                      size={16}
                      className="flex-shrink-0 mt-0.5"
                      style={{ color: "#4A7FC1" }}
                    />
                    <div>
                      <p
                        className="text-xs uppercase tracking-wide mb-0.5"
                        style={{ color: "#9D7070" }}
                      >
                        Venue
                      </p>
                      <p
                        className="text-sm font-medium"
                        style={{ color: "#4B3832" }}
                      >
                        {WEDDING_CONFIG.events.betrothal.venue}
                      </p>
                      {WEDDING_CONFIG.events.betrothal.mapsUrl && (
                        <a
                          href={WEDDING_CONFIG.events.betrothal.mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-outline mt-3 text-xs py-1.5 px-4 inline-flex"
                          style={{ borderColor: "#4A7FC1", color: "#4A7FC1" }}
                        >
                          <MapPin size={12} />
                          View on Map
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Betrothal countdown */}
                {!engagementComplete && (
                  <div
                    className="mt-8 pt-6"
                    style={{ borderTop: "1px solid rgba(74,127,193,0.15)" }}
                  >
                    <CountdownTimer
                      targetDate={engagementDate}
                      label="Days Until Betrothal"
                      onComplete={() => {
                        setEngagementComplete(true);
                        handleCountdownComplete("engagement");
                      }}
                    />
                  </div>
                )}
                {engagementComplete && (
                  <div
                    className="mt-8 pt-6 text-center"
                    style={{ borderTop: "1px solid rgba(74,127,193,0.15)" }}
                  >
                    <div
                      className="flex flex-col items-center gap-2"
                      style={{ animation: "fade-up 0.8s ease-out both" }}
                    >
                      <div className="flex items-center justify-center gap-2.5">
                        <div
                          style={{
                            width: 28,
                            height: "1px",
                            background:
                              "linear-gradient(90deg, transparent, rgba(74,127,193,0.4))",
                          }}
                        />
                        <Sparkles
                          size={12}
                          className="animate-sparkle-twinkle"
                          style={{
                            color: "#4A7FC1",
                            filter: "drop-shadow(0 0 4px rgba(74,127,193,0.4))",
                          }}
                        />
                        <div
                          style={{
                            width: 28,
                            height: "1px",
                            background:
                              "linear-gradient(90deg, rgba(74,127,193,0.4), transparent)",
                          }}
                        />
                      </div>
                      <p
                        className="font-serif italic"
                        style={{
                          fontSize: "clamp(1.1rem, 3vw, 1.5rem)",
                          letterSpacing: "0.1em",
                          margin: 0,
                          background:
                            "linear-gradient(90deg, #4A7FC1 0%, #7BB8D6 25%, #4A7FC1 50%, #7BB8D6 75%, #4A7FC1 100%)",
                          backgroundSize: "200% auto",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                          animation:
                            "united-shimmer 3s ease-in-out infinite, united-glow 2.5s ease-in-out infinite",
                        }}
                      >
                        Betrothed
                      </p>
                      <div className="flex items-center justify-center gap-2.5">
                        <div
                          style={{
                            width: 28,
                            height: "1px",
                            background:
                              "linear-gradient(90deg, transparent, rgba(74,127,193,0.4))",
                          }}
                        />
                        <Sparkles
                          size={12}
                          className="animate-sparkle-twinkle"
                          style={{
                            color: "#4A7FC1",
                            filter: "drop-shadow(0 0 4px rgba(74,127,193,0.4))",
                            animationDelay: "1s",
                          }}
                        />
                        <div
                          style={{
                            width: 28,
                            height: "1px",
                            background:
                              "linear-gradient(90deg, rgba(74,127,193,0.4), transparent)",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Wedding card */}
              <div
                className="wedding-card wedding-card-enhanced p-8"
                data-aos="fade-left"
                data-aos-delay="200"
                style={eventsLayerStyle(
                  ANIMATION_CONFIG.parallax.layers.foreground * 0.5,
                )}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(168,201,230,0.2)" }}
                  >
                    <Sparkles size={20} style={{ color: "#5B9BD5" }} />
                  </div>
                  <div>
                    <p
                      className="text-xs uppercase tracking-widest mb-0.5"
                      style={{ color: "#5B9BD5" }}
                    >
                      Holy Matrimony
                    </p>
                    <h3
                      className="font-serif text-xl"
                      style={{ color: "#4B3832" }}
                    >
                      Wedding Ceremony
                    </h3>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar
                      size={16}
                      className="flex-shrink-0 mt-0.5"
                      style={{ color: "#5B9BD5" }}
                    />
                    <div>
                      <p
                        className="text-xs uppercase tracking-wide mb-0.5"
                        style={{ color: "#9D7070" }}
                      >
                        Date
                      </p>
                      <p
                        className="text-sm font-medium"
                        style={{ color: "#4B3832" }}
                      >
                        {WEDDING_CONFIG.events.wedding.dateLabel}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock
                      size={16}
                      className="flex-shrink-0 mt-0.5"
                      style={{ color: "#5B9BD5" }}
                    />
                    <div>
                      <p
                        className="text-xs uppercase tracking-wide mb-0.5"
                        style={{ color: "#9D7070" }}
                      >
                        Time
                      </p>
                      <p
                        className="text-sm font-medium"
                        style={{ color: "#4B3832" }}
                      >
                        {WEDDING_CONFIG.events.wedding.time}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin
                      size={16}
                      className="flex-shrink-0 mt-0.5"
                      style={{ color: "#5B9BD5" }}
                    />
                    <div>
                      <p
                        className="text-xs uppercase tracking-wide mb-0.5"
                        style={{ color: "#9D7070" }}
                      >
                        Venue
                      </p>
                      <p
                        className="text-sm font-medium"
                        style={{ color: "#4B3832" }}
                      >
                        {WEDDING_CONFIG.events.wedding.venue}
                      </p>
                      {WEDDING_CONFIG.events.wedding.mapsUrl && (
                        <a
                          href={WEDDING_CONFIG.events.wedding.mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-outline mt-3 text-xs py-1.5 px-4 inline-flex"
                          style={{ borderColor: "#5B9BD5", color: "#5B9BD5" }}
                        >
                          <MapPin size={12} />
                          View on Map
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    {WEDDING_CONFIG.events.wedding.receptionVenue && (
                      <MapPin
                        size={16}
                        className="flex-shrink-0 mt-0.5"
                        style={{ color: "#5B9BD5" }}
                      />
                    )}
                    <div>
                      {WEDDING_CONFIG.events.wedding.receptionVenue && (
                        <p
                          className="text-xs uppercase tracking-wide mb-0.5"
                          style={{ color: "#9D7070" }}
                        >
                          Reception Venue
                        </p>
                      )}
                      <p
                        className="text-sm font-medium"
                        style={{ color: "#4B3832" }}
                      >
                        {WEDDING_CONFIG.events.wedding.receptionVenue}
                      </p>
                      {WEDDING_CONFIG.events.wedding.receptionMapsUrl && (
                        <a
                          href={WEDDING_CONFIG.events.wedding.receptionMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-outline mt-3 text-xs py-1.5 px-4 inline-flex"
                          style={{ borderColor: "#5B9BD5", color: "#5B9BD5" }}
                        >
                          <MapPin size={12} />
                          View on Map
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Wedding countdown */}
                <div
                  className="mt-8 pt-6"
                  style={{ borderTop: "1px solid rgba(168,201,230,0.2)" }}
                >
                  <CountdownTimer
                    targetDate={weddingDate}
                    label="Days Until Wedding"
                    onComplete={() => handleCountdownComplete("wedding")}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════ GALLERY ══════════ */}
        <section
          id="gallery"
          ref={galleryParallaxRef as React.RefObject<HTMLElement>}
          className="py-20 px-4 bg-blush-gradient relative overflow-hidden"
        >
          {/* Floating decorations */}
          <FloatingDecorations types={["flowers", "sparkles"]} maxCount={6} />

          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 70% 30%, #C5E0FF 0%, transparent 60%)",
              ...galleryLayerStyle(ANIMATION_CONFIG.parallax.layers.background),
            }}
          />
          <div className="max-w-5xl mx-auto relative z-10">
            <div
              ref={galleryHeaderRef}
              className="text-center mb-14"
              style={galleryHeaderStyle}
            >
              <div className="inline-flex items-center gap-2 mb-4">
                <div
                  style={{
                    height: 1,
                    width: 36,
                    background: "rgba(74,127,193,0.4)",
                  }}
                />
                <Camera size={14} style={{ color: "#4A7FC1" }} />
                <div
                  style={{
                    height: 1,
                    width: 36,
                    background: "rgba(74,127,193,0.4)",
                  }}
                />
              </div>
              <h2 className="section-title mb-3">Cherished Moments</h2>
              <div className="wedding-divider mx-auto" />
              <p className="section-subtitle mt-4 max-w-sm mx-auto">
                A glimpse into our beautiful journey together.
              </p>
            </div>
            <PhotoGallery images={galleryImages} />
          </div>
        </section>

        {/* ══════════ WISHES / RSVP ══════════ */}
        <RSVPSection />

        {/* ══════════ FOOTER ══════════ */}
        <footer
          className="relative py-16 px-4 overflow-hidden"
          style={{
            background: "linear-gradient(160deg, #4B3832 0%, #3A2C28 100%)",
          }}
        >
          {/* Petal overlay */}
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage:
                "radial-gradient(circle at 30% 50%, #C5E0FF 0%, transparent 50%), radial-gradient(circle at 70% 50%, #A8C9E6 0%, transparent 50%)",
            }}
          />

          <div
            ref={footerRef}
            className="max-w-2xl mx-auto text-center relative z-10"
            style={footerStyle}
          >
            {/* Heart */}
            <div className="flex justify-center mb-5">
              <div style={{ animation: "heartbeat 2.2s ease-in-out infinite" }}>
                <Heart size={32} fill="#A8C9E6" style={{ color: "#A8C9E6" }} />
              </div>
            </div>

            {/* Names */}
            <h2
              className="font-serif italic mb-2"
              style={{ fontSize: "clamp(2rem, 5vw, 3rem)", color: "#A8C9E6" }}
            >
              {WEDDING_CONFIG.couple.displayNames}
            </h2>
            <p
              className="font-serif italic text-sm mb-6"
              style={{ color: "rgba(168,201,230,0.65)" }}
            >
              Getting Married · {weddingDateFormatted}
            </p>

            {/* Divider */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <div
                style={{
                  height: 1,
                  width: 50,
                  background: "rgba(168,201,230,0.3)",
                }}
              />
              <span style={{ color: "#4A7FC1", fontSize: "0.9rem" }}>♥</span>
              <div
                style={{
                  height: 1,
                  width: 50,
                  background: "rgba(168,201,230,0.3)",
                }}
              />
            </div>

            <p
              className="text-sm leading-relaxed mb-2"
              style={{ color: "rgba(255,248,240,0.55)" }}
            >
              {WEDDING_CONFIG.couple.sharingHappiness}
            </p>
            {/* <p className="font-medium text-base mb-8" style={{ color: '#A8C9E6' }}>Joel &amp; Megha</p> */}

            <p className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
              © 2026 {WEDDING_CONFIG.couple.displayNames} · Crafted with love ♥
            </p>
          </div>
        </footer>
      </div>

      {/* Back to top */}
      <button
        className={`back-to-top ${showBackToTop ? "visible" : ""}`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        <ChevronUp size={22} strokeWidth={2.5} />
      </button>
    </>
  );
};

export default Index;
