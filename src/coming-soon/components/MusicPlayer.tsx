import { useCallback, useEffect, useRef, useState } from "react";
import { comingSoonConfig } from "../config";
import { song } from "../audio/song";

const { music, copy } = comingSoonConfig;

/**
 * "Our Song" — a small, visually secondary floating control over the shared
 * `song` singleton.
 *
 * Playback normally starts at the opening gate, whose tap is a real user
 * gesture. When the gate is switched off, this falls back to attempting
 * autoplay and, if the browser refuses, starting the song on the visitor's
 * first tap/click/keypress/scroll anywhere on the page.
 */
export const MusicPlayer = () => {
  const [playing, setPlaying] = useState(song.playing);
  const hintShown = useRef(false);
  const [showHint, setShowHint] = useState(false);

  const revealHint = useCallback(() => {
    if (hintShown.current) return;
    hintShown.current = true;
    setShowHint(true);
  }, []);

  // Follow the shared element so the icon is right however playback began
  useEffect(() => song.subscribe(setPlaying), []);

  useEffect(() => {
    if (song.playing) revealHint();
  }, [revealHint]);

  useEffect(() => {
    if (!music.tryAutoplay || music.entryGate || song.playing) return;

    let cleanup = () => {};
    const start = () => {
      void song.play().then((ok) => ok && revealHint());
      cleanup();
    };

    void song.play().then((ok) => {
      if (ok) {
        revealHint();
        return;
      }
      if (!music.startOnFirstInteraction) return;
      const events: (keyof WindowEventMap)[] = [
        "pointerdown",
        "touchstart",
        "keydown",
        "wheel",
      ];
      events.forEach((type) =>
        window.addEventListener(type, start, { once: true, passive: true }),
      );
      cleanup = () =>
        events.forEach((type) => window.removeEventListener(type, start));
    });

    return () => cleanup();
  }, [revealHint]);

  useEffect(() => {
    if (!showHint) return;
    const id = window.setTimeout(() => setShowHint(false), 5500);
    return () => window.clearTimeout(id);
  }, [showHint]);

  const toggle = () => {
    void song.toggle().then(revealHint);
  };

  return (
    <div
      className="cs-music cs-reveal"
      style={{ "--d": "2.5s" } as React.CSSProperties}
    >
      {showHint && (
        <p className="cs-music__hint" role="status">
          {copy.musicHint}
        </p>
      )}

      <button
        type="button"
        className="cs-music__btn"
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? `Pause ${music.label}` : `Play ${music.label}`}
      >
        <span
          className={`cs-eq${playing ? " cs-eq--on" : ""}`}
          aria-hidden="true"
        >
          <span />
          <span />
          <span />
          <span />
        </span>
        <span className="cs-music__label">{music.label}</span>
      </button>
    </div>
  );
};

export default MusicPlayer;
