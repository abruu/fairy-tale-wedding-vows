
import React, { useEffect, useState } from 'react';
import Fireworks from './Fireworks';

interface PreloaderProps {
  onLoaded?: () => void;
}

const Preloader: React.FC<PreloaderProps> = ({ onLoaded }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [showFireworks, setShowFireworks] = useState(false);
  // Disable fireworks flag
  const enableFireworks = false;

  useEffect(() => {
    const timer = setTimeout(() => {
      // Only show fireworks if enabled
      if (enableFireworks) {
        setShowFireworks(true);
        setTimeout(() => {
          setIsLoading(false);
          if (onLoaded) onLoaded();
        }, 3000); // Show fireworks for 3 seconds before completing
      } else {
        // If fireworks disabled, just complete loading
        setIsLoading(false);
        if (onLoaded) onLoaded();
      }
    }, 4000); // Extended to 4 seconds (2 seconds extra)

    return () => clearTimeout(timer);
  }, [onLoaded, enableFireworks]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center">
      {showFireworks && enableFireworks && <Fireworks duration={3000} />}
      <div className="relative">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
      {/* <p className="mt-6 text-primary font-serif text-xl italic">A Fairy Tale Beginning...</p> */}
      <p className="mt-4 text-primary/80 font-serif text-lg italic">"God has made everything beautiful in its time"</p>
      <p className="mt-1 text-primary/70 font-serif text-sm">Ecclesiastes 3:11</p>
    </div>
  );
};

export default Preloader;
