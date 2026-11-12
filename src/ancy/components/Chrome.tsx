import React, { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUp, Menu, Music2, X } from "lucide-react";
import { SITE } from "../config";
import { Wreath } from "./Botanicals";

/* ─── Navigation ─── */

export interface NavItem {
  id: string;
  label: string;
}

export const Nav: React.FC<{
  items: NavItem[];
  active: string;
  onNavigate: (id: string) => void;
  music: ReturnType<typeof useMusic>;
}> = ({ items, active, onNavigate, music }) => {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id: string) => {
    setOpen(false);
    onNavigate(id);
  };

  return (
    <>
      <nav className={`aa-nav ${solid || open ? "is-solid" : ""}`} aria-label="Sections">
        <button type="button" className="aa-nav-mono aa-script" onClick={() => go("home")} aria-label="Back to top">
          {SITE.couple.monogram[0]}
          <span className="amp">&amp;</span>
          {SITE.couple.monogram[1]}
        </button>
        <div className="aa-nav-links">
          {items.map((it) => (
            <button
              type="button"
              key={it.id}
              className={`aa-nav-link ${active === it.id ? "is-active" : ""}`}
              aria-current={active === it.id ? "true" : undefined}
              onClick={() => go(it.id)}
            >
              {it.label}
            </button>
          ))}
        </div>
        <div className="aa-nav-end">
          {music.enabled && <MusicButton playing={music.playing} onToggle={music.toggle} />}
          <button
          type="button"
          className="aa-nav-toggle"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>
      <div className={`aa-nav-sheet ${open ? "is-open" : ""}`} aria-hidden={!open}>
        {items.map((it) => (
          <button type="button" key={it.id} onClick={() => go(it.id)} tabIndex={open ? 0 : -1}>
            {it.label}
          </button>
        ))}
      </div>
    </>
  );
};

/* ─── Music ─── */

/** Owns the one <audio>. `play` must be called synchronously inside a user gesture. */
export const useMusic = () => {
  const audio = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!SITE.musicUrl) return;
    const a = new Audio(SITE.musicUrl);
    a.loop = true;
    a.preload = "auto";
    a.onplay = () => setPlaying(true);
    a.onpause = () => setPlaying(false);
    a.load(); // buffer now so the tap starts the song instantly
    audio.current = a;
    // Native looping leaves an audible gap at the seam (MP3 padding + decoder
    // restart). Jump back to the start just before the end to hide it.
    const seam = window.setInterval(() => {
      if (!a.paused && a.duration && a.currentTime >= a.duration - 0.35) a.currentTime = 0.02;
    }, 40);
    return () => {
      window.clearInterval(seam);
      a.pause();
      a.src = "";
    };
  }, []);

  const play = useCallback(() => {
    void audio.current?.play().catch(() => setPlaying(false));
  }, []);
  const toggle = useCallback(() => {
    const a = audio.current;
    if (!a) return;
    if (a.paused) play();
    else a.pause();
  }, [play]);

  return { enabled: !!SITE.musicUrl, playing, play, toggle };
};

const MusicButton: React.FC<{ playing: boolean; onToggle: () => void }> = ({ playing, onToggle }) => (
  <button
    type="button"
    className="aa-music"
    onClick={onToggle}
    aria-label={playing ? "Pause music" : "Play music"}
    aria-pressed={playing}
  >
    {playing ? (
      <span className="aa-music-bars" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </span>
    ) : (
      <Music2 size={16} aria-hidden="true" />
    )}
  </button>
);

/* ─── Footer ─── */

export const Footer: React.FC<{ onTop: () => void }> = ({ onTop }) => (
  <footer className="aa-footer">
    <Wreath className="aa-band-wreath" seed={9} />
    <div className="aa-footer-inner">
      <p className="aa-eyebrow" data-reveal>
        With love &amp; prayers
      </p>
      <span className="aa-footer-orn" aria-hidden="true">
        <i />
      </span>
      <p className="aa-footer-names aa-script" data-reveal="blur">
        Anson Francis
      </p>
    </div>

    <div className="aa-footer-bar">
      <button type="button" className="aa-footer-top" onClick={onTop}>
        <ArrowUp aria-hidden="true" />
        Back to top
      </button>
    </div>
  </footer>
);
