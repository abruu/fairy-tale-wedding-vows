import { comingSoonConfig } from "../config";

const { music } = comingSoonConfig;

/**
 * One shared audio element for "Our Song".
 *
 * Both the opening gate and the floating control drive this singleton, so the
 * song survives re-renders and there is never a second copy playing. Browsers
 * only allow audible playback that originates from a real user gesture — the
 * gate provides exactly that, which is why the song starts reliably there.
 */
let el: HTMLAudioElement | null = null;
const listeners = new Set<(playing: boolean) => void>();

const emit = () => {
  const playing = !!el && !el.paused && !el.muted;
  listeners.forEach((fn) => fn(playing));
};

const get = (): HTMLAudioElement => {
  if (!el) {
    el = new Audio(music.src);
    el.loop = true;
    el.preload = "auto";
    el.volume = music.volume;
    el.addEventListener("play", emit);
    el.addEventListener("pause", emit);
    el.addEventListener("volumechange", emit);
  }
  return el;
};

export const song = {
  /** Preload the file so the gate tap starts playback instantly. */
  prime() {
    const a = get();
    a.load();
  },

  /** Start (or resume) with sound. Resolves false if the browser refused. */
  async play(): Promise<boolean> {
    const a = get();
    a.muted = false;
    a.volume = music.volume;
    try {
      await a.play();
      emit();
      return true;
    } catch {
      emit();
      return false;
    }
  },

  pause() {
    el?.pause();
  },

  async toggle(): Promise<void> {
    const a = get();
    if (a.paused || a.muted) await song.play();
    else a.pause();
  },

  get playing(): boolean {
    return !!el && !el.paused && !el.muted;
  },

  subscribe(fn: (playing: boolean) => void): () => void {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },

  /** Tear down completely (used when the page unmounts). */
  dispose() {
    if (!el) return;
    el.pause();
    el.src = "";
    el = null;
    listeners.clear();
  },
};

export default song;
