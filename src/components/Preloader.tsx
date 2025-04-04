
import React, { useEffect, useState } from 'react';

interface PreloaderProps {
  onLoaded?: () => void;
}

const Preloader: React.FC<PreloaderProps> = ({ onLoaded }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (onLoaded) onLoaded();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onLoaded]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
      <p className="mt-6 text-primary font-serif text-xl italic">A Fairy Tale Beginning...</p>
    </div>
  );
};

export default Preloader;
