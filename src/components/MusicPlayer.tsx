import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MusicPlayerProps {
  audioSrc: string;
  autoPlay?: boolean;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ audioSrc, autoPlay = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [autoplayFailed, setAutoplayFailed] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio(audioSrc);
    audio.loop = true;
    audio.preload = "auto";
    audio.oncanplaythrough = () => setAudioLoaded(true);
    audioRef.current = audio;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, [audioSrc]);

  // Handle autoplay when enabled
  useEffect(() => {
    if (audioRef.current && autoPlay && audioLoaded) {
      // Try to play with a slight delay to ensure audio is fully loaded
      setTimeout(() => {
        if (audioRef.current) {
          const playPromise = audioRef.current.play();
          
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                setIsPlaying(true);
                setAutoplayFailed(false);
              })
              .catch(error => {
                console.error("Autoplay prevented:", error);
                setIsPlaying(false);
                setAutoplayFailed(true);
              });
          }
        }
      }, 500);
    }
  }, [autoPlay, audioLoaded]);

  // Try to play again if user interacts with the page
  useEffect(() => {
    const handleUserInteraction = () => {
      if (audioRef.current && autoPlay && autoplayFailed) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
              setAutoplayFailed(false);
            })
            .catch(err => {
              console.error("Error playing audio after interaction:", err);
            });
        }
      }
    };

    // Add event listeners for common user interactions
    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
  }, [autoPlay, autoplayFailed]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch(err => {
              console.error("Error playing audio:", err);
              setIsPlaying(false);
            });
        }
      }
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-3 bg-background/80 backdrop-blur-sm p-3 rounded-full shadow-lg border border-accent/30">
      <button 
        onClick={togglePlay}
        className="w-10 h-10 rounded-full flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
        aria-label={isPlaying ? "Pause music" : "Play music"}
      >
        {isPlaying ? <Pause size={18} /> : <Play size={18} />}
      </button>
      
      <button 
        onClick={toggleMute}
        className="w-8 h-8 rounded-full flex items-center justify-center bg-secondary/20 text-text hover:bg-secondary/40 transition-all"
        aria-label={isMuted ? "Unmute music" : "Mute music"}
      >
        {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
      </button>
      
      <span className={cn(
        "text-xs font-medium transition-opacity duration-300", 
        isPlaying ? "opacity-100" : "opacity-0"
      )}>
        ♫ Wedding Melody
      </span>
    </div>
  );
};

export default MusicPlayer;
