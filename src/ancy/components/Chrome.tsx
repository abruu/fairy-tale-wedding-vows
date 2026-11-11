import React, { useCallback, useEffect, useRef, useState } from "react";
import { Menu, Music2, X } from "lucide-react";
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
    audio.current = a;
    return () => {
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

export const Footer: React.FC = () => {
  const d = new Date(SITE.betrothal.iso);
  const { brideFamily: bf, groomFamily: gf } = SITE;
  return (
    <footer className="aa-footer">
      <Wreath className="aa-band-wreath" seed={9} />
      <div style={{ position: "relative" }}>
        <p className="aa-eyebrow" data-reveal>
          With love &amp; prayers
        </p>
        <p className="aa-footer-names aa-script" data-reveal="blur">
          {SITE.couple.bride}
          <span className="amp">&amp;</span>
          {SITE.couple.groom}
        </p>
        <p className="aa-footer-date" data-reveal>
          {String(d.getDate()).padStart(2, "0")} · {String(d.getMonth() + 1).padStart(2, "0")} · {d.getFullYear()}
        </p>
        <p className="aa-footer-note" data-reveal>
          {SITE.footerNote}
        </p>

        <div className="aa-footer-fams">
          <div data-reveal>
            <p className="aa-eyebrow">Bride's family</p>
            <strong>{bf.parents}</strong>
            {bf.house}, {bf.address}
          </div>
          <div data-reveal style={{ "--d": "0.1s" } as React.CSSProperties}>
            <p className="aa-eyebrow">Groom's family</p>
            <strong>{gf.parents}</strong>
            {gf.house}, {gf.address}
          </div>
        </div>

        <p className="aa-footer-small">Made with love · {d.getFullYear()}</p>
      </div>
    </footer>
  );
};
