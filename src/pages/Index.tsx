import React, { useState, useEffect, useRef } from 'react';
import { Heart, Calendar, Clock, MapPin, ChevronUp, Sparkles, Camera } from 'lucide-react';
import PhotoGallery from '@/components/PhotoGallery';
import MusicPlayer from '@/components/MusicPlayer';
import VideoIntro from '@/components/VideoIntro';
import CountdownTimer from '@/components/CountdownTimer';
import OurStory from '@/components/OurStory';
import FloatingPetals from '@/components/FloatingPetals';
import RSVPSection from '@/components/RSVPSection';
import BirthdayFireworks from '@/components/BirthdayFireworks';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { WEDDING_CONFIG } from '@/config/dates';

const Index = () => {
  const [isLoaded, setIsLoaded]         = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [showFireworks, setShowFireworks] = useState(WEDDING_CONFIG.features.showFireworks);
  const [showVideo, setShowVideo]       = useState(WEDDING_CONFIG.features.showVideo);
  const [engagementComplete, setEngagementComplete] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [hasScrolled, setHasScrolled]   = useState(false);
  const mainContentRef = useRef<HTMLDivElement>(null);

  const engagementDate = WEDDING_CONFIG.dates.engagement;
  const weddingDate    = WEDDING_CONFIG.dates.wedding;

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

  // Scroll handler: music on first scroll, back-to-top button
  useEffect(() => {
    const onScroll = () => {
      if (!hasScrolled) {
        setHasScrolled(true);
        if (WEDDING_CONFIG.features.autoPlayMusic) setMusicEnabled(true);
      }
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [hasScrolled]);

  // AOS init
  useEffect(() => {
    AOS.init({ duration: 750, once: true, easing: 'ease-out-cubic', offset: 80 });
    const timer = setTimeout(() => {
      if (showFireworks) setShowFireworks(false);
    }, WEDDING_CONFIG.media.fireworks.duration);
    return () => clearTimeout(timer);
  }, [showFireworks]);

  const handleCountdownComplete = (type: 'engagement' | 'wedding') => {
    if (!WEDDING_CONFIG.features.countdownTriggers.enabled) return;
    if (type === 'wedding') {
      if (WEDDING_CONFIG.features.countdownTriggers.showFireworks) {
        setShowFireworks(true);
        setTimeout(() => setShowFireworks(false), WEDDING_CONFIG.features.countdownTriggers.fireworksDuration);
      }
      if (WEDDING_CONFIG.features.countdownTriggers.showVideo) setShowVideo(true);
    }
  };

  const scrollToContent = () => {
    mainContentRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const galleryImages = [
    { src: '/lovable-uploads/Image (1).jpeg',  alt: 'Family photo at the engagement ceremony' },
    { src: '/lovable-uploads/Image (2).jpeg',  alt: 'Alan and Agnes on stairs in traditional attire' },
    { src: '/lovable-uploads/Image (3).jpeg',  alt: 'Alan and Agnes on stairs' },
    { src: '/lovable-uploads/Image (4).jpeg',  alt: 'Alan and Agnes on stairs' },
    { src: '/lovable-uploads/Image (5).jpeg',  alt: 'Alan and Agnes posing by a console table' },
    { src: '/lovable-uploads/Image (6).jpeg',  alt: 'Alan and Agnes walking outdoors' },
    { src: '/lovable-uploads/Image (7).jpeg',  alt: 'Alan and Agnes in an elegant setting' },
  ];

  const storyItems = [
    { date: 'January 27, 2025',  content: 'First call with both families via matrimonial.' },
    { date: 'February 1, 2025',  content: "First visit to Agnes's home with family (Pennukaanal)." },
    { date: 'February 5, 2025',  content: "Agnes and her family visited Alan's home." },
    { date: 'February 14, 2025', content: "Final Pennukaanal: Went to Agnes's home with family and relatives to finalize the date." },
    { date: 'February 18, 2025', content: 'Official first date.' },
    { date: 'March 2, 2025',     content: 'Engagement Fixation.' },
    { date: 'April 26, 2025',    content: 'Betrothal.' },
    { date: 'August 28, 2025',   content: 'Marriage. A new forever begins.' },
  ];

  const weddingDateFormatted = new Date(WEDDING_CONFIG.dates.wedding).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'long', year: 'numeric',
  });

  return (
    <>
      <VideoIntro onComplete={() => { setIsLoaded(true); setMusicEnabled(true); }} />

      {isLoaded && (
        <>
          {showFireworks && (
            <BirthdayFireworks
              duration={WEDDING_CONFIG.media.fireworks.duration}
              intensity={WEDDING_CONFIG.media.fireworks.intensity}
              autoStart
              startDelay={WEDDING_CONFIG.media.fireworks.startDelay}
            />
          )}
          <MusicPlayer audioSrc={WEDDING_CONFIG.media.musicUrl} autoPlay={musicEnabled} />
        </>
      )}

      <div className="min-h-screen overflow-x-hidden" style={{ background: 'hsl(33 100% 97%)' }}>

        {/* ══════════ HERO ══════════ */}
        <section
          id="hero"
          className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Background image */}
          <div className="absolute inset-0 z-0">
            <img
              src="/lovable-uploads/Image (11).jpeg"
              alt="Daril and Sneha"
              className="w-full h-full object-cover"
              style={{ filter: 'brightness(0.75)' }}
            />
            <div className="hero-overlay absolute inset-0" />
          </div>

          {/* Floating petals on hero */}
          <FloatingPetals count={10} />

          {/* Decorative corner frames (desktop) */}
          <div className="absolute inset-0 pointer-events-none z-10 hidden md:block">
            <div className="absolute top-[22%] left-14 w-28 h-28 animate-wiggle">
              <img src="/lovable-uploads/Image.jpeg" alt="" aria-hidden="true"
                className="w-full h-full object-cover rounded-xl"
                style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.35)', border: '2px solid rgba(230,203,168,0.6)' }} />
            </div>
            <div className="absolute top-[22%] right-14 w-28 h-28 animate-wiggle-delay">
              <img src="/lovable-uploads/Image (10).jpeg" alt="" aria-hidden="true"
                className="w-full h-full object-cover rounded-xl"
                style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.35)', border: '2px solid rgba(230,203,168,0.6)' }} />
            </div>
            <div className="absolute bottom-[24%] left-14 w-24 h-24 animate-wiggle-delay-2">
              <img src="/lovable-uploads/Image (6).jpeg" alt="" aria-hidden="true"
                className="w-full h-full object-cover rounded-xl"
                style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.35)', border: '2px solid rgba(230,203,168,0.6)' }} />
            </div>
            <div className="absolute bottom-[24%] right-14 w-24 h-24 animate-wiggle">
              <img src="/lovable-uploads/Image (4).jpeg" alt="" aria-hidden="true"
                className="w-full h-full object-cover rounded-xl"
                style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.35)', border: '2px solid rgba(230,203,168,0.6)' }} />
            </div>
          </div>

          {/* Central hero content */}
          <div className="relative z-20 text-center px-5 max-w-3xl mx-auto">
            {/* Tag line */}
            <p
              className="text-xs uppercase tracking-[0.3em] mb-5 font-medium"
              style={{ color: '#E6CBA8', animation: 'fade-in 1s ease-out 0.2s both' }}
            >
              Wedding Invitation
            </p>

            {/* Names */}
            <h1
              className="hero-names mb-3"
              style={{
                fontSize: 'clamp(2.8rem, 9vw, 6.5rem)',
                animation: 'fade-up 1s ease-out 0.4s both',
              }}
            >
              Daril &amp; Sneha
            </h1>

            {/* Divider */}
            <div
              className="flex items-center justify-center gap-4 mb-4"
              style={{ animation: 'fade-in 0.8s ease-out 0.7s both' }}
            >
              <div style={{ height: 1, width: 60, background: 'rgba(230,203,168,0.5)' }} />
              <Heart size={14} fill="#E6CBA8" style={{ color: '#E6CBA8' }} />
              <div style={{ height: 1, width: 60, background: 'rgba(230,203,168,0.5)' }} />
            </div>

            {/* Date */}
            <p
              className="font-serif italic text-lg md:text-xl mb-2"
              style={{ color: 'rgba(230,203,168,0.92)', animation: 'fade-in 0.8s ease-out 0.9s both' }}
            >
              {weddingDateFormatted}
            </p>
            <p
              className="text-xs uppercase tracking-[0.2em] mb-8"
              style={{ color: 'rgba(255,255,255,0.55)', animation: 'fade-in 0.8s ease-out 1s both' }}
            >
              St. George Shrine Church · Kulathuvayal
            </p>

            {/* Countdown */}
            {!showVideo && (
              <div style={{ animation: 'fade-up 0.9s ease-out 1.1s both' }}>
                <CountdownTimer
                  targetDate={weddingDate}
                  label="Countdown to Our Wedding"
                  className="mb-6"
                  onComplete={() => handleCountdownComplete('wedding')}
                />
              </div>
            )}

            {/* Engagement countdown */}
            {!engagementComplete && !showVideo && (
              <div style={{ animation: 'fade-up 0.9s ease-out 1.3s both', marginTop: '1rem' }}>
                <CountdownTimer
                  targetDate={engagementDate}
                  label="Countdown to Betrothal"
                  onComplete={() => handleCountdownComplete('engagement')}
                />
              </div>
            )}

            {/* CTA */}
            <button
              onClick={scrollToContent}
              className="btn-primary mt-8"
              style={{ animation: 'fade-up 0.8s ease-out 1.4s both' }}
            >
              View Invitation ↓
            </button>
          </div>

          {/* Scroll indicator */}
          <div
            className="scroll-indicator"
            onClick={scrollToContent}
            aria-label="Scroll down"
          >
            <span className="text-xs uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem' }}>
              scroll
            </span>
            <div className="scroll-mouse" />
          </div>
        </section>

        {/* ══════════ SCRIPTURE BANNER ══════════ */}
        <section className="py-14 px-4 bg-champagne-gradient relative overflow-hidden" data-aos="fade-up">
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-5"
            style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #B76E79 0%, transparent 70%), radial-gradient(circle at 80% 50%, #E6CBA8 0%, transparent 70%)' }}
          />
          <div className="max-w-2xl mx-auto text-center relative">
            <p className="font-serif italic leading-relaxed" style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)', color: '#7A4A4A' }}>
              "Let all that you do be done in love."
            </p>
            <p className="mt-3 text-xs uppercase tracking-widest" style={{ color: '#B76E79' }}>
              1 Corinthians 16:14
            </p>
          </div>
        </section>

        {/* Main content ref */}
        <div ref={mainContentRef} />

        {/* ══════════ INVITATION ══════════ */}
        <section id="invitation" className="py-20 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="wedding-card p-8 md:p-14" data-aos="fade-up">
              {/* Decorative top */}
              <div className="flex justify-center mb-6">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(183,110,121,0.1)' }}
                >
                  <Heart size={28} fill="#B76E79" style={{ color: '#B76E79' }} />
                </div>
              </div>

              <h2 className="section-title mb-2">An Invitation From</h2>
              <div className="wedding-divider mx-auto mb-8" />

              <div className="text-center space-y-3">
                <p className="font-medium text-lg" style={{ color: '#4B3832' }}>
                  Mr. Jose Syriac &amp; Mrs. Shyla Jose
                </p>
                <p className="text-sm" style={{ color: '#9D7070' }}>
                  Kanakkanchery (H), Kulathuvayal, Kozhikode
                </p>

                <p className="max-w-xl mx-auto text-sm md:text-base leading-relaxed pt-4" style={{ color: '#5A3E3E' }}>
                  With hearts full of joy and gratitude, invite you and your family to join us
                  in celebrating the blessed occasion of the marriage of our beloved son,
                </p>

                <div className="py-4">
                  <p className="font-serif italic text-3xl md:text-4xl" style={{ color: '#B76E79' }}>
                    Daril K Jose
                  </p>
                  <p className="my-2 text-sm" style={{ color: '#9D7070' }}>with</p>
                  <p className="font-serif italic text-3xl md:text-4xl" style={{ color: '#B76E79' }}>
                    Sneha Kurian
                  </p>
                </div>

                <p className="text-xs leading-relaxed pt-2" style={{ color: '#9D7070' }}>
                  Daughter of Mr. Shijimon Joseph &amp; Mrs. Jessy Shiji<br />
                  Vennayippilli (H), Thiruvambady, Kozhikode
                </p>

                <div className="pt-6 flex justify-center">
                  <div
                    className="inline-flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium"
                    style={{ background: 'rgba(183,110,121,0.08)', color: '#B76E79', border: '1px solid rgba(183,110,121,0.2)' }}
                  >
                    <Sparkles size={14} />
                    Are Officially Married
                    <Sparkles size={14} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════ OUR STORY ══════════ */}
        <section id="our-story" className="py-20 px-4 bg-rose-gradient relative overflow-hidden">
          {/* Background decoration */}
          <div
            aria-hidden="true"
            className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-20 -translate-y-1/2 translate-x-1/2"
            style={{ background: 'radial-gradient(circle, #F8C8DC, transparent)' }}
          />
          <div className="max-w-4xl mx-auto relative z-10">
            <div className="text-center mb-14" data-aos="fade-up">
              <div className="inline-flex items-center gap-2 mb-4">
                <div style={{ height: 1, width: 36, background: 'rgba(183,110,121,0.4)' }} />
                <Heart size={14} style={{ color: '#B76E79' }} />
                <div style={{ height: 1, width: 36, background: 'rgba(183,110,121,0.4)' }} />
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
        <section id="events" className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-14" data-aos="fade-up">
              <div className="inline-flex items-center gap-2 mb-4">
                <div style={{ height: 1, width: 36, background: 'rgba(183,110,121,0.4)' }} />
                <Calendar size={14} style={{ color: '#B76E79' }} />
                <div style={{ height: 1, width: 36, background: 'rgba(183,110,121,0.4)' }} />
              </div>
              <h2 className="section-title mb-3">Event Details</h2>
              <div className="wedding-divider mx-auto" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Ceremony card */}
              <div className="wedding-card p-8" data-aos="fade-right" data-aos-delay="100">
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(183,110,121,0.1)' }}
                  >
                    <Heart size={20} style={{ color: '#B76E79' }} />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest mb-0.5" style={{ color: '#B76E79' }}>Holy Matrimony</p>
                    <h3 className="font-serif text-xl" style={{ color: '#4B3832' }}>The Wedding Ceremony</h3>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar size={16} className="flex-shrink-0 mt-0.5" style={{ color: '#B76E79' }} />
                    <div>
                      <p className="text-xs uppercase tracking-wide mb-0.5" style={{ color: '#9D7070' }}>Date</p>
                      <p className="text-sm font-medium" style={{ color: '#4B3832' }}>Thursday, 28th August 2025</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock size={16} className="flex-shrink-0 mt-0.5" style={{ color: '#B76E79' }} />
                    <div>
                      <p className="text-xs uppercase tracking-wide mb-0.5" style={{ color: '#9D7070' }}>Time</p>
                      <p className="text-sm font-medium" style={{ color: '#4B3832' }}>10:30 AM</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin size={16} className="flex-shrink-0 mt-0.5" style={{ color: '#B76E79' }} />
                    <div>
                      <p className="text-xs uppercase tracking-wide mb-0.5" style={{ color: '#9D7070' }}>Venue</p>
                      <p className="text-sm font-medium" style={{ color: '#4B3832' }}>St. George Shrine Church</p>
                      <p className="text-xs mt-0.5" style={{ color: '#9D7070' }}>Kulathuvayal</p>
                      <a
                        href="https://maps.app.goo.gl/95Xt8TP1BnYuHmep8"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-outline mt-3 text-xs py-1.5 px-4 inline-flex"
                      >
                        <MapPin size={12} />
                        View on Map
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reception card */}
              <div className="wedding-card p-8" data-aos="fade-left" data-aos-delay="200">
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(230,203,168,0.2)' }}
                  >
                    <Sparkles size={20} style={{ color: '#C9A96E' }} />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest mb-0.5" style={{ color: '#C9A96E' }}>Celebration</p>
                    <h3 className="font-serif text-xl" style={{ color: '#4B3832' }}>Wedding Reception</h3>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar size={16} className="flex-shrink-0 mt-0.5" style={{ color: '#C9A96E' }} />
                    <div>
                      <p className="text-xs uppercase tracking-wide mb-0.5" style={{ color: '#9D7070' }}>Date</p>
                      <p className="text-sm font-medium" style={{ color: '#4B3832' }}>Thursday, 28th August 2025</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock size={16} className="flex-shrink-0 mt-0.5" style={{ color: '#C9A96E' }} />
                    <div>
                      <p className="text-xs uppercase tracking-wide mb-0.5" style={{ color: '#9D7070' }}>Time</p>
                      <p className="text-sm font-medium" style={{ color: '#4B3832' }}>from 12:30 PM</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin size={16} className="flex-shrink-0 mt-0.5" style={{ color: '#C9A96E' }} />
                    <div>
                      <p className="text-xs uppercase tracking-wide mb-0.5" style={{ color: '#9D7070' }}>Venue</p>
                      <p className="text-sm font-medium" style={{ color: '#4B3832' }}>Doffodils Convention Center</p>
                      <p className="text-xs mt-0.5" style={{ color: '#9D7070' }}>Mukkalil, Chembara</p>
                      <a
                        href="https://maps.app.goo.gl/TsqQkt5Wn3BfLyjU8"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-outline mt-3 text-xs py-1.5 px-4 inline-flex"
                        style={{ borderColor: '#C9A96E', color: '#C9A96E' }}
                      >
                        <MapPin size={12} />
                        View on Map
                      </a>
                    </div>
                  </div>
                </div>

                {/* Countdown in reception card */}
                {!showVideo && (
                  <div className="mt-8 pt-6" style={{ borderTop: '1px solid rgba(230,203,168,0.3)' }}>
                    <CountdownTimer
                      targetDate={weddingDate}
                      label="Countdown to Wedding"
                      onComplete={() => handleCountdownComplete('wedding')}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════ GALLERY ══════════ */}
        <section id="gallery" className="py-20 px-4 bg-blush-gradient relative overflow-hidden">
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle at 70% 30%, #F8C8DC 0%, transparent 60%)' }}
          />
          <div className="max-w-5xl mx-auto relative z-10">
            <div className="text-center mb-14" data-aos="fade-up">
              <div className="inline-flex items-center gap-2 mb-4">
                <div style={{ height: 1, width: 36, background: 'rgba(183,110,121,0.4)' }} />
                <Camera size={14} style={{ color: '#B76E79' }} />
                <div style={{ height: 1, width: 36, background: 'rgba(183,110,121,0.4)' }} />
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
          style={{ background: 'linear-gradient(160deg, #4B3832 0%, #3A2C28 100%)' }}
        >
          {/* Petal overlay */}
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-5"
            style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #F8C8DC 0%, transparent 50%), radial-gradient(circle at 70% 50%, #E6CBA8 0%, transparent 50%)' }}
          />

          <div className="max-w-2xl mx-auto text-center relative z-10" data-aos="fade-up">
            {/* Heart */}
            <div className="flex justify-center mb-5">
              <div style={{ animation: 'heartbeat 2.2s ease-in-out infinite' }}>
                <Heart size={32} fill="#E6CBA8" style={{ color: '#E6CBA8' }} />
              </div>
            </div>

            {/* Names */}
            <h2
              className="font-serif italic mb-2"
              style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#E6CBA8' }}
            >
              Daril &amp; Sneha
            </h2>
            <p className="font-serif italic text-sm mb-6" style={{ color: 'rgba(230,203,168,0.65)' }}>
              Married · {weddingDateFormatted}
            </p>

            {/* Divider */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <div style={{ height: 1, width: 50, background: 'rgba(230,203,168,0.3)' }} />
              <span style={{ color: '#B76E79', fontSize: '0.9rem' }}>♥</span>
              <div style={{ height: 1, width: 50, background: 'rgba(230,203,168,0.3)' }} />
            </div>

            <p className="text-sm leading-relaxed mb-2" style={{ color: 'rgba(255,248,240,0.55)' }}>
              Sharing the happiness — though miles apart, always in our hearts.
            </p>
            <p className="font-medium text-base mb-8" style={{ color: '#E6CBA8' }}>Joel &amp; Megha</p>

            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
              © 2025 Daril &amp; Sneha · Crafted with love ♥
            </p>
          </div>
        </footer>
      </div>

      {/* Back to top */}
      <button
        className={`back-to-top ${showBackToTop ? 'visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        <ChevronUp size={22} strokeWidth={2.5} />
      </button>
    </>
  );
};

export default Index;
