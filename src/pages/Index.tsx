import React, { useState, useEffect, useRef } from 'react';
import { Heart, Calendar, Clock, MapPin, Music, ChevronUp } from 'lucide-react';
import PhotoGallery from '@/components/PhotoGallery';
import MusicPlayer from '@/components/MusicPlayer';
import Preloader from '@/components/Preloader';
import CountdownTimer from '@/components/CountdownTimer';
import OurStory from '@/components/OurStory';
import BirthdayFireworks from '@/components/BirthdayFireworks';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { WEDDING_CONFIG } from '@/config/dates';

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [showFireworks, setShowFireworks] = useState(WEDDING_CONFIG.features.showFireworks);
  const [showVideo, setShowVideo] = useState(WEDDING_CONFIG.features.showVideo);
  const [engagementComplete, setEngagementComplete] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const mainContentRef = useRef<HTMLDivElement>(null);

  // Important dates from config
  const engagementDate = WEDDING_CONFIG.dates.engagement;
  const weddingDate = WEDDING_CONFIG.dates.wedding;

  // Check if engagement is complete (one day after engagement date)
  useEffect(() => {
    const checkEngagementStatus = () => {
      const now = new Date();
      const engagementDay = new Date(engagementDate);

      // Add one day to engagement date
      const dayAfterEngagement = new Date(engagementDay);
      dayAfterEngagement.setDate(dayAfterEngagement.getDate() + 1);

      // If current time is after one day from engagement, mark as complete
      if (now.getTime() > dayAfterEngagement.getTime()) {
        setEngagementComplete(true);
      }
    };

    // Check engagement status on component mount
    checkEngagementStatus();

    // Also check periodically (every hour)
    const interval = setInterval(checkEngagementStatus, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [engagementDate]);

  // Hide scroll indicator when user scrolls down and play music on first scroll
  useEffect(() => {
    const handleScroll = () => {
      // Check if this is the first scroll since page load
      if (!hasScrolled) {
        setHasScrolled(true);
        // Play music on first scroll
        if (WEDDING_CONFIG.features.autoPlayMusic) {
          console.log("Attempting to play music on first scroll");
          setMusicEnabled(true);
        }
      }
      
      // Hide scroll indicator after scrolling down
      if (window.scrollY > 200) {
        setShowScrollIndicator(false);
        // Show back to top button when scrolled down
        setShowBackToTop(true);
      } else {
        setShowScrollIndicator(true);
        // Hide back to top button when near the top
        setShowBackToTop(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasScrolled]);

  // Effect to handle music initialization - simplified
  useEffect(() => {
    if (isLoaded && WEDDING_CONFIG.features.autoPlayMusic) {
      // Music will play on first scroll
      console.log("Music will play on first scroll");
    }
  }, [isLoaded]);

  // Function to trigger when countdown completes
  const handleCountdownComplete = (type: 'engagement' | 'wedding') => {
    // Only proceed if countdown triggers are enabled
    if (!WEDDING_CONFIG.features.countdownTriggers.enabled) return;

    // Mark engagement as complete if it's the engagement countdown
    if (type === 'engagement') {
      // Don't immediately set as complete - will be set by the useEffect after one day
      // Just show fireworks and video
    }

    // Show fireworks if enabled in config
    if (WEDDING_CONFIG.features.countdownTriggers.showFireworks) {
      setShowFireworks(true);
    }

    // Show video for both engagement and wedding countdowns if enabled in config
    if (WEDDING_CONFIG.features.countdownTriggers.showVideo) {
      setShowVideo(true);
    }

    // Set a timeout to hide fireworks after duration
    if (WEDDING_CONFIG.features.countdownTriggers.showFireworks) {
      setTimeout(() => {
        setShowFireworks(false);
      }, WEDDING_CONFIG.features.countdownTriggers.fireworksDuration);
    }
  };

  const galleryImages = [
    {
      src: '/lovable-uploads/7dbb0a93-7d77-4171-9d43-8658d5c94f0c.png',
      alt: 'Family photo at the engagement ceremony',
    },
    {
      src: '/lovable-uploads/a9e1bdbe-a0d1-434a-81ca-fdb7daae1387.png',
      alt: 'Alan and Agnes in formal attire, black and white portrait',
    },
    {
      src: '/lovable-uploads/7d71f697-651e-40a8-b0c1-638f367d2d5e.png',
      alt: 'Alan and Agnes on stairs in traditional attire',
    },
    {
      src: '/lovable-uploads/PHOTO-2025-04-04-23-46-23 (1).jpg',
      alt: 'Another photo of Alan and Agsssnes on stairs',
    },
    {
      src: '/lovable-uploads/PHOTO-2025-04-04-23-46-23.jpg',
      alt: 'Another photo of Alan and Agsssnes on stairs',
    },
    {
      src: '/lovable-uploads/6d90887f-7fa1-48b6-bb81-542ccb9368ad.png',
      alt: 'Alan and Agnes posing by a console table',
    },
    {
      src: '/lovable-uploads/24e56c2c-ab84-444a-9d24-dca21ca15850.png',
      alt: 'Alan and Agnes walking outdoors',
    },
    {
      src: '/lovable-uploads/e4fc4e4e-b77c-4058-9b0e-e5c2e2d982f9.png',
      alt: 'Alan and Agnes in front of floral backdrop',
    },
    {
      src: '/lovable-uploads/21fa5845-2592-4d58-bb74-5a5a79e21c35.png',
      alt: 'Alan and Agnes in front of a hotel',
    },
    {
      src: '/lovable-uploads/86d60ec9-5ee5-4524-a090-9bdc7e89bc26.png',
      alt: 'Close-up portrait of Alan and Agnes',
    },
    {
      src: '/lovable-uploads/204885e5-d672-42f6-bdd0-a2944490fa46.png',
      alt: 'Alan and Agnes in an elegant setting',
    },
  ];

  const storyItems = [
    { date: 'January 27, 2025', content: 'First call with both families via matrimonial.' },
    { date: 'January 28, 2025', content: 'Started talking personally on WhatsApp.' },
    { date: 'February 1, 2025', content: 'First visit to Agnes\'s home with family (Pennukaanal).' },
    { date: 'February 5, 2025', content: 'Agnes and her family visited Alan\'s home.' },
    { date: 'February 14, 2025', content: 'Final Pennukaanal: Went to Agnes\'s home with family and relatives to finalize the date.' },
    { date: 'February 18, 2025', content: 'Official first date.' },
    { date: 'March 2, 2025', content: 'Engagement Fixation.' },
    { date: 'April 26, 2025', content: 'Betrothal.' },
    { date: 'May 17, 2025', content: 'Marriage.' },
  ];

  useEffect(() => {
    // Initialize AOS animation library
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-in-out',
    });

    // Set up the cleanup timer for fireworks if needed
    const timer = setTimeout(() => {
      // This is just to ensure fireworks eventually stop if user stays on page for a long time
      if (showFireworks) {
        setShowFireworks(false);
      }
    }, WEDDING_CONFIG.media.fireworks.duration);

    return () => {
      clearTimeout(timer);
    };
  }, [showFireworks]);

  // Function to scroll down when indicator is clicked
  const scrollToContent = () => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth',
      });
    }
  };

  // Function to scroll back to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      <Preloader onLoaded={() => setIsLoaded(true)} />

      {isLoaded && (
        <>
          {showFireworks && (
            <BirthdayFireworks
              duration={WEDDING_CONFIG.media.fireworks.duration}
              intensity={WEDDING_CONFIG.media.fireworks.intensity}
              autoStart={true}
              startDelay={WEDDING_CONFIG.media.fireworks.startDelay}
            />
          )}
          <MusicPlayer audioSrc={WEDDING_CONFIG.media.musicUrl} autoPlay={musicEnabled} />
        </>
      )}

      <div className="min-h-screen bg-background text-text overflow-x-hidden">
        {/* Header / Hero Section */}
        <header className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 py-20 bg-gradient-to-b from-accent/5 via-background to-background overflow-hidden">
          {/* Background image */}
          <div className="absolute inset-0 z-0">
            <img
              src="/lovable-uploads/7d71f697-651e-40a8-b0c1-638f367d2d5e.png"
              alt="Alan and Agnes"
              className="w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-accent/40 via-background/90 to-background"></div>
          </div>

          {/* Decorative Frame Images */}
          <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
            {/* Top Left Frame - Hidden on mobile, visible on larger screens */}
            <div className="absolute hidden md:block top-1/4 left-16 w-32 h-32 transform -rotate-6 hover:rotate-0 transition-transform animate-wiggle">
              <img
                src="/lovable-uploads/a9e1bdbe-a0d1-434a-81ca-fdb7daae1387.png"
                alt="Frame decoration"
                className="w-full h-full object-cover rounded-lg shadow-lg border-2 border-primary/30"
              />
            </div>

            {/* Top Right Frame - Hidden on mobile, visible on larger screens */}
            <div className="absolute hidden md:block top-1/4 right-16 w-32 h-32 transform rotate-6 hover:rotate-0 transition-transform animate-wiggle-delay">
              <img
                src="/lovable-uploads/6d90887f-7fa1-48b6-bb81-542ccb9368ad.png"
                alt="Frame decoration"
                className="w-full h-full object-cover rounded-lg shadow-lg border-2 border-primary/30"
              />
            </div>

            {/* Bottom Left Frame - Adjusted position for mobile */}
            <div className="absolute bottom-20 md:bottom-1/3 left-4 md:left-16 w-20 md:w-32 h-20 md:h-32 transform rotate-6 hover:rotate-0 transition-transform animate-wiggle-delay-2">
              <img
                src="/lovable-uploads/e4fc4e4e-b77c-4058-9b0e-e5c2e2d982f9.png"
                alt="Frame decoration"
                className="w-full h-full object-cover rounded-lg shadow-lg border-2 border-primary/30"
              />
            </div>

            {/* Bottom Right Frame - Adjusted position for mobile */}
            <div className="absolute bottom-20 md:bottom-1/3 right-4 md:right-16 w-20 md:w-32 h-20 md:h-32 transform -rotate-6 hover:rotate-0 transition-transform animate-wiggle">
              <img
                src="/lovable-uploads/86d60ec9-5ee5-4524-a090-9bdc7e89bc26.png"
                alt="Frame decoration"
                className="w-full h-full object-cover rounded-lg shadow-lg border-2 border-primary/30"
              />
            </div>
          </div>

          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/3 -left-10 w-24 h-24 rounded-full bg-primary/5 blur-3xl"></div>
            <div className="absolute bottom-1/4 -right-10 w-32 h-32 rounded-full bg-accent/10 blur-3xl"></div>
          </div>

          <div className="max-w-4xl mx-auto relative z-10" data-aos="fade-up" data-aos-duration="1200">
            <h1 className="text-4xl md:text-6xl font-serif text-heading italic mb-4 wedding-title">
              A Fairy Tale Beginning
            </h1>
            <div className="wedding-divider mx-auto w-32 my-4"></div>
            <p className="text-2xl md:text-4xl font-serif text-primary mb-6">
              Alan Biju & Agnes George
            </p>
            <p className="text-lg text-text/80 mb-8">
              Are getting engaged... and married!...
            </p>

            {showVideo ? (
              <div className="mt-8 mb-4">
                <div className="flex justify-center items-center mb-4">
                  <div className="flex items-center">
                    <h3 className="text-xl md:text-2xl font-medium text-primary mr-3">Our Engagement Ceremony</h3>
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full mt-2 flex items-center">
                      <span className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></span>
                      LIVE
                    </span>
                  </div>
                </div>
                <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg shadow-xl">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src={WEDDING_CONFIG.media.youtubeUrl}
                    title="Perfect"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
              </div>
            ) : engagementComplete ? (
              <div className="mt-8 mb-4">
                <div className="text-center mb-4">
                  <h3 className="text-xl md:text-2xl font-medium text-primary">Countdown to Wedding</h3>
                </div>
                <CountdownTimer
                  targetDate={weddingDate}
                  label=""
                  className="scale-90 sm:scale-110 transform origin-top"
                  onComplete={() => handleCountdownComplete('wedding')}
                />
              </div>
            ) : (
              <div className="mt-8 mb-4">
                <div className="text-center mb-4">
                  <h3 className="text-xl md:text-2xl font-medium text-primary">Countdown to Engagement</h3>
                </div>
                <CountdownTimer
                  targetDate={engagementDate}
                  label=""
                  className="scale-90 sm:scale-110 transform origin-top"
                  onComplete={() => handleCountdownComplete('engagement')}
                />
              </div>
            )}
          </div>

          {/* Scroll Indicator - Optimized UI/UX */}
          {/* {showScrollIndicator && (
            <div className="scroll-indicator" onClick={scrollToContent}>
              <div className="scroll-indicator-header">Scroll Down</div>
              <span className="scroll-indicator-text">Discover Our Wedding Journey</span>
              <div className="scroll-indicator-icon"></div>
            </div>
          )} */}
        </header>

        {/* Main Content */}
        <main ref={mainContentRef} className="container mx-auto px-4 py-16 max-w-5xl overflow-hidden">
          {/* Invitation Section */}
          <section className="wedding-card p-8 md:p-12 mb-16" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-serif text-heading text-center mb-8 wedding-title">
              <Heart className="inline-block mr-2 text-primary" size={28} strokeWidth={1.5} />
              An Invitation From
            </h2>

            <div className="text-center">
              <p className="text-lg md:text-xl mb-2">Mr. Biju T Kurian & Mrs. Mini Biju</p>
              <p className="text-sm md:text-base text-text/70 mb-8">Thadamuriyil (H), Lakkattoor</p>

              <p className="max-w-3xl mx-auto text-base md:text-lg text-text/80 mb-8 leading-relaxed">
                With hearts full of joy and gratitude, invite you and your family to join us in celebrating the blessed occasions of the engagement & marriage of our beloved son,
              </p>

              <p className="text-2xl md:text-3xl font-serif text-primary mb-3">Alan Biju</p>
              <p className="text-lg">&</p>
              <p className="text-2xl md:text-3xl font-serif text-primary mt-3 mb-6">Agnes George</p>

              <p className="text-sm text-text/70">
                (Daughter of Mr. George Thomas & Mrs. Ashly George, Vattakunnel (H), Pala)
              </p>
            </div>
          </section>

          {/* Events Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 overflow-hidden">
            {/* Engagement Section */}
            <section className="wedding-card p-8 md:p-10" data-aos="fade-right">
              <h2 className="text-2xl md:text-3xl font-serif text-heading text-center mb-6 wedding-title">
                The Engagement
              </h2>

              <div className="space-y-6 mb-8">
                <div className="flex items-start" data-aos="fade-up" data-aos-delay="100">
                  <Calendar className="text-primary flex-shrink-0 mr-4 mt-1" size={20} />
                  <div>
                    <p className="font-medium text-primary mb-1">When</p>
                    <p>Saturday, 26th April 2025</p>
                  </div>
                </div>

                <div className="flex items-start" data-aos="fade-up" data-aos-delay="150">
                  <Clock className="text-primary flex-shrink-0 mr-4 mt-1" size={20} />
                  <div>
                    <p className="font-medium text-primary mb-1">Time</p>
                    <p>5:00 PM</p>
                  </div>
                </div>

                <div className="flex items-start" data-aos="fade-up" data-aos-delay="200">
                  <MapPin className="text-primary flex-shrink-0 mr-4 mt-1" size={20} />
                  <div>
                    <p className="font-medium text-primary mb-1">Venue</p>
                    <p>St. Thomas Cathedral, Pala</p>
                    <p className="text-sm text-text/70 mt-1">Reception Dinner: Bishop Vayalil Parish Hall, Pala </p>
                    <a
                      href="https://maps.app.goo.gl/iTj5eJdmZHJ9tGw37"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center mt-2 px-3 py-1 bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors"
                    >
                      <MapPin size={16} className="mr-1" />
                      <span>View Location on Google Maps</span>
                    </a>
                  </div>
                </div>
              </div>
            </section>

            {/* Wedding Section */}
            <section className="wedding-card p-8 md:p-10" data-aos="fade-left">
              <h2 className="text-2xl md:text-3xl font-serif text-heading text-center mb-6 wedding-title">
                The Wedding
              </h2>

              <div className="space-y-6 mb-8">
                <div className="flex items-start" data-aos="fade-up" data-aos-delay="100">
                  <Calendar className="text-primary flex-shrink-0 mr-4 mt-1" size={20} />
                  <div>
                    <p className="font-medium text-primary mb-1">When</p>
                    <p>Saturday, 17th May 2025</p>
                  </div>
                </div>

                <div className="flex items-start" data-aos="fade-up" data-aos-delay="150">
                  <Clock className="text-primary flex-shrink-0 mr-4 mt-1" size={20} />
                  <div>
                    <p className="font-medium text-primary mb-1">Time</p>
                    <p>3:30 PM</p>
                  </div>
                </div>

                <div className="flex items-start" data-aos="fade-up" data-aos-delay="200">
                  <MapPin className="text-primary flex-shrink-0 mr-4 mt-1" size={20} />
                  <div>
                    <p className="font-medium text-primary mb-1">Venue</p>
                    <p>Marth Mariam Church, Cheppumpara</p>
                    <p className="text-sm text-text/70 mt-1">Reception: Marth Mariam Church Parish Hall (6:30 PM - 9:00 PM)</p>
                    <a
                      href="https://maps.app.goo.gl/zqdSg5wqe8sK8B8r8"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center mt-2 px-3 py-1 bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors"
                    >
                      <MapPin size={16} className="mr-1" />
                      <span>View Location on Google Maps</span>
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-8" data-aos="fade-up" data-aos-delay="250">
                {!engagementComplete && (
                  <CountdownTimer
                    targetDate={weddingDate}
                    label="Countdown to Wedding"
                    className="scale-90 sm:scale-100"
                    onComplete={() => handleCountdownComplete('wedding')}
                  />
                )}
              </div>
            </section>
          </div>

          {/* Our Story Section */}
          <section className="wedding-card p-8 md:p-12 mb-16" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-serif text-heading text-center mb-8 wedding-title">
              <Heart className="inline-block mr-2 text-primary" size={28} strokeWidth={1.5} />
              Our Story
            </h2>

            <p className="text-center text-lg text-text/80 mb-10 max-w-2xl mx-auto">
              How it all began & the journey so far…
            </p>

            <OurStory items={storyItems} />
          </section>

          {/* Gallery Section */}
          <section className="mb-16" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-serif text-heading text-center mb-8 wedding-title">
              <Music className="inline-block mr-2 text-primary" size={28} strokeWidth={1.5} />
              Cherished Moments
            </h2>
            <div className="wedding-divider mx-auto mb-8"></div>

            <PhotoGallery images={galleryImages} />
          </section>

          {/* Quote Section */}
          <section className="text-center my-20 wedding-card p-8" data-aos="fade-up">
            <p className="text-xl md:text-2xl font-serif text-primary italic max-w-3xl mx-auto leading-relaxed">
              "Let all that you do be done in love."
            </p>
            <p className="text-sm text-text/70 mt-3">(1 Corinthians 16:14)</p>
          </section>
        </main>

        {/* Back to Top Button */}
        <div 
          className={`back-to-top ${showBackToTop ? 'visible' : ''}`} 
          onClick={scrollToTop}
          aria-label="Scroll to top"
        >
          <ChevronUp size={28} strokeWidth={2.5} />
        </div>

        {/* Footer */}
        <footer className="text-center py-12 border-t border-accent/10 bg-gradient-to-t from-accent/5 via-background to-background overflow-hidden">
          <div className="container mx-auto px-4 max-w-5xl" data-aos="fade-up">
            <p className="text-lg text-text/80 mb-4">Sharing the Happiness:<br/>Though miles apart, always in our hearts—</p>
            <p className="text-xl font-medium text-primary mb-6">Angitha Biju & Jibin Sebastian</p>

            <div className="wedding-divider mx-auto my-6"></div>

            <p className="text-lg text-text/80 mb-3">With Love and Blessings,</p>
            <p className="text-xl font-medium text-primary mb-10">Biju T Kurian, Mini Biju & Family</p>

            <p className="text-2xl md:text-3xl font-serif text-heading mb-3 wedding-title">Alan & Agnes</p>
            <p className="text-lg font-medium text-primary mb-8">Engagement: 26.04.2025 | Wedding: 17.05.2025</p>

            <p className="text-sm text-text/60"> 2025 Alan & Agnes. Crafted with love.</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Index;
