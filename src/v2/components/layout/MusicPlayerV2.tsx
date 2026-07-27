import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { WEDDING_CONFIG } from '@/config/dates';

const WAVE_DELAYS = ['0s', '0.15s', '0.3s', '0.45s', '0.3s'];

interface MusicPlayerV2Props {
  autoPlay?: boolean;
  forcePlayRef?: React.MutableRefObject<(() => void) | null>;
}

/**
 * Elegant floating music player with glassmorphism and gold accents.
 */
export const MusicPlayerV2: React.FC<MusicPlayerV2Props> = ({ autoPlay = false, forcePlayRef }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [autoplayFailed, setAutoplayFailed] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const audioSrc = WEDDING_CONFIG.media.musicUrl;

  useEffect(() => {
    const audio = new Audio(audioSrc);
    audio.loop = true;
    audio.preload = 'auto';
    audio.oncanplaythrough = () => setAudioLoaded(true);
    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [audioSrc]);

  useEffect(() => {
    if (!audioRef.current || !autoPlay || !audioLoaded) return;
    audioRef.current.play()
      .then(() => { setIsPlaying(true); setAutoplayFailed(false); })
      .catch(() => { setIsPlaying(false); setAutoplayFailed(true); });
  }, [autoPlay, audioLoaded]);

  useEffect(() => {
    if (!forcePlayRef) return;
    forcePlayRef.current = () => {
      if (!audioRef.current) return;
      audioRef.current.play()
        .then(() => { setIsPlaying(true); setAutoplayFailed(false); })
        .catch(() => { setAutoplayFailed(true); });
    };
    return () => { if (forcePlayRef) forcePlayRef.current = null; };
  }, [forcePlayRef, audioLoaded]);

  useEffect(() => {
    const retry = () => {
      if (!audioRef.current || !autoPlay || !autoplayFailed) return;
      audioRef.current.play()
        .then(() => { setIsPlaying(true); setAutoplayFailed(false); })
        .catch(() => {});
    };
    document.addEventListener('click', retry);
    document.addEventListener('keydown', retry);
    document.addEventListener('touchstart', retry);
    return () => {
      document.removeEventListener('click', retry);
      document.removeEventListener('keydown', retry);
      document.removeEventListener('touchstart', retry);
    };
  }, [autoPlay, autoplayFailed]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div className="v2-music-player">
      <motion.button
        onClick={togglePlay}
        className="v2-music-btn"
        aria-label={isPlaying ? 'Pause music' : 'Play music'}
        whileTap={{ scale: 0.88 }}
      >
        {isPlaying ? <Pause size={16} /> : <Play size={16} />}
      </motion.button>

      <div
        className="v2-music-wave"
        style={{ opacity: isPlaying ? 1 : 0, transition: 'opacity 0.3s' }}
        aria-hidden="true"
      >
        {WAVE_DELAYS.map((delay, i) => (
          <div
            key={i}
            className="v2-music-wave-bar"
            style={{
              height: '100%',
              animationDelay: delay,
              animationPlayState: isPlaying ? 'running' : 'paused',
            }}
          />
        ))}
      </div>

      <button
        onClick={toggleMute}
        aria-label={isMuted ? 'Unmute' : 'Mute'}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--v2-gold)',
          padding: '4px',
          opacity: 0.7,
          transition: 'opacity 0.2s',
        }}
      >
        {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
      </button>
    </div>
  );
};
