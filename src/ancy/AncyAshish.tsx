import React, { useCallback, useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { SITE } from "./config";
import { useReducedMotion } from "@/v2/hooks/useReducedMotion";
import { Opening } from "./components/Opening";
import { Hero } from "./components/Hero";
import { Invitation } from "./components/Invitation";
import { Events, CountdownBand } from "./components/Events";
import { Gallery } from "./components/Gallery";
import { Wishes } from "./components/Wishes";
import { Nav, Footer, useMusic, type NavItem } from "./components/Chrome";
import "./ancy.css";

const NAV: NavItem[] = [
  { id: "invitation", label: "Invitation" },
  { id: "celebrations", label: "Celebrations" },
  { id: "gallery", label: "Gallery" },
  { id: "wishes", label: "Wishes" },
];

/** Adds `.is-in` to every [data-reveal] element as it scrolls into view. */
const useReveal = () => {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }),
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
};

const useActiveSection = (ids: string[]) => {
  const [active, setActive] = useState("home");
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ["home", ...ids].forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [ids]);
  return active;
};

const AncyAshish: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const [opening, setOpening] = useState(true);
  const [revealed, setRevealed] = useState(false);
  const lenis = useRef<Lenis | null>(null);
  const music = useMusic();
  const active = useActiveSection(NAV.map((n) => n.id));
  useReveal();

  useEffect(() => {
    document.title = SITE.seo.title;
  }, []);

  // Smooth scroll — skipped entirely for reduced-motion visitors.
  useEffect(() => {
    if (reducedMotion) return;
    const l = new Lenis({ lerp: 0.09 });
    lenis.current = l;
    let raf = 0;
    const loop = (t: number) => {
      l.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      l.destroy();
      lenis.current = null;
    };
  }, [reducedMotion]);

  // The page stays still while the card is closed.
  useEffect(() => {
    const html = document.documentElement;
    if (opening) {
      window.scrollTo(0, 0);
      html.style.overflow = "hidden";
      lenis.current?.stop();
    } else {
      html.style.overflow = "";
      lenis.current?.start();
    }
    return () => {
      html.style.overflow = "";
    };
  }, [opening, reducedMotion]);

  const navigate = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (lenis.current) lenis.current.scrollTo(id === "home" ? 0 : el, { offset: -56, duration: 1.6 });
    else el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <div className="aa-root">
      <div className="aa-grain" aria-hidden="true" />

      {opening && (
        <Opening
          reducedMotion={reducedMotion}
          onStart={music.play}
          onReveal={() => setRevealed(true)}
          onComplete={() => setOpening(false)}
        />
      )}

      {!opening && <Nav items={NAV} active={active} onNavigate={navigate} music={music} />}

      <main aria-hidden={opening || undefined}>
        <Hero revealed={revealed} reducedMotion={reducedMotion} onEnter={() => navigate("invitation")} />
        <Invitation />
        <Events />
        <CountdownBand />
        <Gallery />
        <Wishes />
      </main>
      <Footer onTop={() => navigate("home")} />
    </div>
  );
};

export default AncyAshish;
