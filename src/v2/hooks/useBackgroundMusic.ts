import { useCallback, useEffect, useRef, useState } from "react";
import { WEDDING_CONFIG } from "@/config/dates";

export type MusicStatus = "off" | "playing" | "unavailable";

export interface BackgroundMusic {
  status: MusicStatus;
  /**
   * Starts playback. Call this synchronously from inside a user-gesture
   * handler (a click/tap listener, with no `await` before it) — that's the
   * only way browsers allow audible playback to begin.
   */
  play: () => void;
  pause: () => void;
  toggle: () => void;
}

/**
 * One `Audio` element shared for the lifetime of the page — created lazily on
 * the first `play()` call, so a visitor who never touches audio never even
 * requests the file. Lifted above both the opening video (which starts it
 * the moment the visitor taps in) and the nav's music button (which just
 * pauses/resumes the same instance), so the song survives that handoff
 * instead of restarting or being fought over by two separate players.
 */
export function useBackgroundMusic(): BackgroundMusic {
  const [status, setStatus] = useState<MusicStatus>("off");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(
    () => () => {
      audioRef.current?.pause();
      audioRef.current = null;
    },
    [],
  );

  const play = useCallback(() => {
    if (status === "unavailable") return;
    if (!audioRef.current) {
      const audio = new Audio(WEDDING_CONFIG.audioUrl);
      audio.loop = true;
      audio.volume = 0.5;
      audio.addEventListener("error", () => setStatus("unavailable"));
      audioRef.current = audio;
    }
    audioRef.current
      .play()
      .then(() => setStatus("playing"))
      .catch(() => setStatus(audioRef.current?.error ? "unavailable" : "off"));
  }, [status]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setStatus("off");
  }, []);

  const toggle = useCallback(() => {
    if (status === "playing") pause();
    else play();
  }, [status, play, pause]);

  return { status, play, pause, toggle };
}
