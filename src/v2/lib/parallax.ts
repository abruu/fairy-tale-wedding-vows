/**
 * Scroll parallax for decorative PNG/SVG layers.
 *
 * Markup: <img class="px" data-speed="0.25" [data-rotate="0.05"]
 *              [data-x="-50%"] [data-flip="x|y|xy"] …>
 * inside a <section> that is position:relative; overflow:hidden.
 *
 * Per frame, for every section near the viewport:
 *   offset     = rect.top + rect.height / 2 − viewportHeight / 2
 *   translateY = −offset × speed
 *   rotation   = rotate × offset (degrees)
 * Speeds are halved below 768px. Nothing runs under prefers-reduced-motion.
 * No background-attachment: fixed anywhere — it breaks on iOS Safari.
 */

interface Layer {
  el: HTMLElement;
  speed: number;
  rotate: number;
  /** Static part of the transform: horizontal centring offset */
  x: string;
  /** Static mirroring, appended after the moving part */
  flip: string;
}

interface Group {
  section: HTMLElement;
  layers: Layer[];
}

const MOBILE_BREAKPOINT = 768;
/** Keep animating a little beyond the viewport so layers don't pop on entry. */
const VIEWPORT_MARGIN = 200;

const FLIPS: Record<string, string> = {
  x: " scale(-1, 1)",
  y: " scale(1, -1)",
  xy: " scale(-1, -1)",
};

function readLayer(el: HTMLElement): Layer {
  return {
    el,
    speed: parseFloat(el.dataset.speed ?? "0") || 0,
    rotate: parseFloat(el.dataset.rotate ?? "0") || 0,
    x: el.dataset.x ?? "0px",
    flip: FLIPS[el.dataset.flip ?? ""] ?? "",
  };
}

function restTransform(l: Layer): string {
  return `translate3d(${l.x}, 0px, 0)${l.flip}`;
}

/** Applies the static (non-moving) transform — used when parallax is off. */
function resetLayers(groups: Group[]) {
  for (const g of groups) for (const l of g.layers) l.el.style.transform = restTransform(l);
}

function collect(root: ParentNode): Group[] {
  const bySection = new Map<HTMLElement, Layer[]>();
  root.querySelectorAll<HTMLElement>(".px").forEach((el) => {
    const section = el.closest("section");
    if (!section) return;
    const list = bySection.get(section) ?? [];
    list.push(readLayer(el));
    bySection.set(section, list);
  });
  return Array.from(bySection, ([section, layers]) => ({ section, layers }));
}

/**
 * Starts parallax for every `.px` layer under `root`. Returns a cleanup
 * function that removes listeners and restores static transforms.
 */
export function initParallax(root: ParentNode = document): () => void {
  const groups = collect(root);
  const reducedMq = window.matchMedia("(prefers-reduced-motion: reduce)");
  let frame = 0;
  let listening = false;

  const update = () => {
    frame = 0;
    const vh = window.innerHeight;
    const factor = window.innerWidth < MOBILE_BREAKPOINT ? 0.5 : 1;

    // Read every rect first, then write — avoids layout thrash between sections.
    const rects = groups.map((g) => g.section.getBoundingClientRect());
    groups.forEach((g, i) => {
      const r = rects[i];
      if (r.bottom < -VIEWPORT_MARGIN || r.top > vh + VIEWPORT_MARGIN) return; // off-screen
      const offset = r.top + r.height / 2 - vh / 2;
      for (const l of g.layers) {
        const y = -offset * l.speed * factor;
        const rot = l.rotate ? ` rotate(${(l.rotate * offset).toFixed(2)}deg)` : "";
        l.el.style.transform = `translate3d(${l.x}, ${y.toFixed(1)}px, 0)${rot}${l.flip}`;
      }
    });
  };

  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };

  const start = () => {
    if (listening) return;
    listening = true;
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    schedule();
  };

  const stop = () => {
    if (!listening) return;
    listening = false;
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", schedule);
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    resetLayers(groups);
  };

  const onMotionPref = () => (reducedMq.matches ? stop() : start());

  resetLayers(groups);
  onMotionPref();
  reducedMq.addEventListener("change", onMotionPref);

  return () => {
    reducedMq.removeEventListener("change", onMotionPref);
    stop();
  };
}
