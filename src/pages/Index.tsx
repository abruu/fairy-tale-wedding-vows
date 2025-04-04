import React, { useState, useEffect } from 'react';
import { Heart, Calendar, Clock, MapPin, Music } from 'lucide-react';
import PhotoGallery from '@/components/PhotoGallery';
import MusicPlayer from '@/components/MusicPlayer';
import Preloader from '@/components/Preloader';
import CountdownTimer from '@/components/CountdownTimer';
import OurStory from '@/components/OurStory';

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [showYoutube, setShowYoutube] = useState(false);

  const galleryImages = [
    { 
      src: '/lovable-uploads/7dbb0a93-7d77-4171-9d43-8658d5c94f0c.png', 
      alt: 'Family photo at the engagement ceremony' 
    },
    { 
      src: '/lovable-uploads/a9e1bdbe-a0d1-434a-81ca-fdb7daae1387.png', 
      alt: 'Alan and Agnes in formal attire, black and white portrait' 
    },
    { 
      src: '/lovable-uploads/7d71f697-651e-40a8-b0c1-638f367d2d5e.png', 
      alt: 'Alan and Agnes on stairs in traditional attire' 
    },
    { 
      src: '/lovable-uploads/f4073b95-9f4d-4bf1-9465-479b63a22248.png', 
      alt: 'Another photo of Alan and Agnes on stairs' 
    },
    { 
      src: '/lovable-uploads/6d90887f-7fa1-48b6-bb81-542ccb9368ad.png', 
      alt: 'Alan and Agnes posing by a console table' 
    },
    { 
      src: '/lovable-uploads/24e56c2c-ab84-444a-9d24-dca21ca15850.png', 
      alt: 'Alan and Agnes walking outdoors' 
    },
    { 
      src: '/lovable-uploads/e4fc4e4e-b77c-4058-9b0e-e5c2e2d982f9.png', 
      alt: 'Alan and Agnes in front of floral backdrop' 
    },
    { 
      src: '/lovable-uploads/21fa5845-2592-4d58-bb74-5a5a79e21c35.png', 
      alt: 'Alan and Agnes in front of a hotel' 
    },
    { 
      src: '/lovable-uploads/86d60ec9-5ee5-4524-a090-9bdc7e89bc26.png', 
      alt: 'Close-up portrait of Alan and Agnes' 
    },
    { 
      src: '/lovable-uploads/204885e5-d672-42f6-bdd0-a2944490fa46.png', 
      alt: 'Alan and Agnes in an elegant setting' 
    }
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
    { date: 'May 17, 2025', content: 'Marriage.' }
  ];

  useEffect(() => {
    // Small delay to ensure the page is fully loaded
    const timer = setTimeout(() => {
      setMusicEnabled(true);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Preloader onLoaded={() => setIsLoaded(true)} />
      
      {isLoaded && (
        <>
          <MusicPlayer audioSrc="/music/wedding-song.mp3" autoPlay={musicEnabled} />
          
          {!musicEnabled && (
            <div 
              className="fixed bottom-6 right-6 z-50 bg-background/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-accent/30 animate-pulse"
              onClick={() => setMusicEnabled(true)}
            >
              <button 
                className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
              >
                <Music size={18} />
                <span className="font-medium">Play Wedding Melody</span>
              </button>
            </div>
          )}
        </>
      )}
      
      <div className="min-h-screen bg-background text-text">
        {/* Header / Hero Section */}
        <header className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 py-20 bg-gradient-to-b from-accent/20 via-background to-background overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img 
              src="/lovable-uploads/7d71f697-651e-40a8-b0c1-638f367d2d5e.png" 
              alt="Alan and Agnes" 
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-accent/70 via-background/90 to-background"></div>
          </div>
          
          {/* Decorative Frame Images */}
          <div className="absolute inset-0 pointer-events-none z-10">
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
            
            {/* Mobile Top Frames - Positioned above the title */}
            <div className="absolute md:hidden top-10 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 transform -rotate-6 hover:rotate-0 transition-transform animate-wiggle">
              <img 
                src="/lovable-uploads/a9e1bdbe-a0d1-434a-81ca-fdb7daae1387.png" 
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
          
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/3 -left-10 w-24 h-24 rounded-full bg-primary/5 blur-3xl"></div>
            <div className="absolute bottom-1/4 -right-10 w-32 h-32 rounded-full bg-accent/10 blur-3xl"></div>
          </div>
          
          <div className="max-w-4xl mx-auto relative z-10" data-aos="fade-up" data-aos-duration="1200">
            <h1 className="text-4xl md:text-6xl font-serif text-heading italic mb-4">
              A Fairy Tale Beginning
            </h1>
            <p className="text-2xl md:text-4xl font-serif text-primary mb-6">
              Alan Biju & Agnes George
            </p>
            <p className="text-lg text-text/80 mb-8">
              Are getting engaged... and married!
            </p>
            
            {showYoutube ? (
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
                    src="https://www.youtube.com/embed/iHfxTCHTtyw?autoplay=1" 
                    title="Perfect" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    referrerPolicy="strict-origin-when-cross-origin" 
                    allowFullScreen
                  />
                </div>
              </div>
            ) : (
              <div className="mt-8 mb-4">
                <div className="text-center mb-4">
                  <h3 className="text-xl md:text-2xl font-medium text-primary">Countdown to Engagement</h3>
                </div>
                <CountdownTimer 
                  targetDate="2025-04-26T17:00:00+05:30" 
                  label=""
                  className="scale-110 transform origin-top"
                />
              </div>
            )}
          </div>
        </header>
        
        {/* Main Content */}
        <main className="container mx-auto px-4 py-16 max-w-5xl">
          {/* Invitation Section */}
          <section className="bg-background/80 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-xl border border-accent/20 mb-16" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-serif text-heading text-center mb-8">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {/* Engagement Section */}
            <section className="bg-background/80 backdrop-blur-sm rounded-2xl p-8 md:p-10 shadow-xl border border-accent/20" data-aos="fade-right">
              <h2 className="text-2xl md:text-3xl font-serif text-heading text-center mb-6">
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
                    <p className="text-sm text-text/70 mt-1">Reception Dinner: Bishop Vayalil Parish Hall, Pala</p>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Wedding Section */}
            <section className="bg-background/80 backdrop-blur-sm rounded-2xl p-8 md:p-10 shadow-xl border border-accent/20" data-aos="fade-left">
              <h2 className="text-2xl md:text-3xl font-serif text-heading text-center mb-6">
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
                  </div>
                </div>
              </div>
              
              <div className="mt-8" data-aos="fade-up" data-aos-delay="250">
                <CountdownTimer 
                  targetDate="2025-05-17T15:30:00+05:30" 
                  label="Countdown to Wedding" 
                />
              </div>
            </section>
          </div>
          
          {/* Our Story Section */}
          <section className="bg-background/80 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-xl border border-accent/20 mb-16" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-serif text-heading text-center mb-8">
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
            <h2 className="text-3xl md:text-4xl font-serif text-heading text-center mb-8">
              <Music className="inline-block mr-2 text-primary" size={28} strokeWidth={1.5} />
              Cherished Moments
            </h2>
            
            <PhotoGallery images={galleryImages} />
          </section>
          
          {/* Quote Section */}
          <section className="text-center my-20" data-aos="fade-up">
            <p className="text-xl md:text-2xl font-serif text-primary italic max-w-3xl mx-auto leading-relaxed">
              "Let all that you do be done in love."
            </p>
            <p className="text-sm text-text/70 mt-3">(1 Corinthians 16:14)</p>
          </section>
        </main>
        
        {/* Footer */}
        <footer className="text-center py-12 border-t border-accent/20 bg-gradient-to-t from-accent/20 via-background to-background">
          <div className="container mx-auto px-4 max-w-5xl" data-aos="fade-up">
            <p className="text-lg text-text/80 mb-4">Sharing the Happiness:<br/>Though miles apart, always in our hearts—</p>
            <p className="text-xl font-medium text-primary mb-6">Angitha Biju & Jibin Sebastian</p>
            
            <p className="text-lg text-text/80 mb-3">With Love and Blessings,</p>
            <p className="text-xl font-medium text-primary mb-10">Biju T Kurian, Mini Biju & Family</p>
            
            <p className="text-2xl md:text-3xl font-serif text-heading mb-3">Alan & Agnes</p>
            <p className="text-lg font-medium text-primary mb-8">Engagement: 26.04.2025 | Wedding: 17.05.2025</p>
            
            <p className="text-sm text-text/60"> 2025 Alan & Agnes. Crafted with love.</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Index;
