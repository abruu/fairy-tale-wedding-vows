import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Music } from 'lucide-react';

interface MusicPlayerProps {
  audioSrc: string;
  autoPlay?: boolean;
  forcePlayRef?: React.MutableRefObject<(() => void) | null>;
}

const WAVE_DELAYS = ['0s', '0.15s', '0.3s', '0.45s', '0.3s'];

const MusicPlayer: React.FC<MusicPlayerProps> = ({ audioSrc, autoPlay = false, forcePlayRef }) => {
  const [isPlaying, setIsPlaying]   = useState(false);
  const [isMuted, setIsMuted]       = useState(false);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [autoplayFailed, setAutoplayFailed] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Init audio
  useEffect(() => {
    const audio = new Audio(audioSrc);
    audio.loop    = true;
    audio.preload = 'auto';
    audio.oncanplaythrough = () => setAudioLoaded(true);
    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [audioSrc]);

  // Autoplay on flag change
  useEffect(() => {
    if (!audioRef.current || !autoPlay || !audioLoaded) return;
    audioRef.current.play()
      .then(() => { setIsPlaying(true); setAutoplayFailed(false); })
      .catch(() => { setIsPlaying(false); setAutoplayFailed(true); });
  }, [autoPlay, audioLoaded]);

  // Expose forcePlay so parent can call audio.play() within user gesture context
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

  // Retry on user interaction (browser policy)
  useEffect(() => {
    const retry = () => {
      if (!audioRef.current || !autoPlay || !autoplayFailed) return;
      audioRef.current.play()
        .then(() => { setIsPlaying(true); setAutoplayFailed(false); })
        .catch(() => {});
    };
    document.addEventListener('click',      retry);
    document.addEventListener('keydown',    retry);
    document.addEventListener('touchstart', retry);
    return () => {
      document.removeEventListener('click',      retry);
      document.removeEventListener('keydown',    retry);
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
    setIsMuted(m => !m);
  };

  return (
    <div
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5"
      style={{
        background: 'rgba(255,248,240,0.88)',
        backdropFilter: 'blur(14px)',
        borderRadius: '3rem',
        padding: '0.5rem 1rem 0.5rem 0.5rem',
        border: '1px solid rgba(248,200,220,0.5)',
        boxShadow: '0 4px 20px rgba(183,110,121,0.18)',
      }}
    >
      {/* Play / Pause */}
      <button
        onClick={togglePlay}
        aria-label={isPlaying ? 'Pause music' : 'Play music'}
        className="flex items-center justify-center rounded-full transition-all duration-200"
        style={{
          width: 40,
          height: 40,
          background: 'linear-gradient(135deg, #B76E79, #C8828D)',
          color: '#fff',
          boxShadow: '0 2px 10px rgba(183,110,121,0.4)',
          flexShrink: 0,
        }}
      >
        {isPlaying ? <Pause size={16} /> : <Play size={16} />}
      </button>

      {/* Wave bars (visible while playing) */}
      <div
        className="flex items-end gap-0.5"
        style={{ height: 18, opacity: isPlaying ? 1 : 0, transition: 'opacity 0.3s' }}
        aria-hidden="true"
      >
        {WAVE_DELAYS.map((delay, i) => (
          <div
            key={i}
            className="music-wave-bar"
            style={{
              height: '100%',
              animationDelay: delay,
              animationPlayState: isPlaying ? 'running' : 'paused',
            }}
          />
        ))}
      </div>

      {/* Note icon when paused */}
      {!isPlaying && (
        <Music size={14} style={{ color: '#B76E79', opacity: 0.7 }} aria-hidden="true" />
      )}

      {/* Mute */}
      <button
        onClick={toggleMute}
        aria-label={isMuted ? 'Unmute' : 'Mute'}
        className="flex items-center justify-center transition-opacity duration-200 hover:opacity-70"
        style={{ color: '#B76E79', padding: '2px' }}
      >
        {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
      </button>
    </div>
  );
};

export default MusicPlayer;
