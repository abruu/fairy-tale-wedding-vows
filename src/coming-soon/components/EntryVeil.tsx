import { useEffect, useRef, useState } from "react";
import { comingSoonConfig } from "../config";
import { song } from "../audio/song";

const { groom, bride, displayDate, copy } = comingSoonConfig;

/**
 * The opening gate — a single tap that opens the invitation *and* starts the
 * song. Because the tap is a real user gesture, playback with sound is always
 * permitted; this is the one dependable way to have the music going for every
 * visitor. Any key, click or tap opens it, so it is never a dead end.
 */
export const EntryVeil = ({ onEnter }: { onEnter: () => void }) => {
  const [leaving, setLeaving] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const done = useRef(false);

  useEffect(() => {
    // No autofocus: it would paint a focus ring over the composition. Keyboard
    // visitors can Tab to the button, and any keypress opens the gate anyway.
    song.prime();
  }, []);

  const enter = () => {
    if (done.current) return;
    done.current = true;
    // Fire inside the gesture so the browser accepts audible playback
    void song.play();
    setLeaving(true);
    window.setTimeout(onEnter, 620);
  };

  // Any key opens it too — except the ones people use to move around
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Tab" || e.key === "Shift") return;
      enter();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={`cs-gate${leaving ? " cs-gate--leaving" : ""}`}
      onClick={enter}
      role="presentation"
    >
      <div className="cs-gate__inner">
        <p className="cs-gate__eyebrow">{copy.enterTitle}</p>

        <p className="cs-gate__names">
          {groom}
          <span className="cs-gate__amp">&amp;</span>
          {bride}
        </p>

        <p className="cs-gate__date">{displayDate}</p>

        <button ref={btnRef} type="button" className="cs-gate__btn" onClick={enter}>
          <span className="cs-gate__ring" aria-hidden="true" />
          <span className="cs-gate__heart" aria-hidden="true">
            ♥
          </span>
          <span className="cs-gate__label">{copy.enterCta}</span>
        </button>

        <p className="cs-gate__note">
          <span aria-hidden="true">♫</span> {copy.enterNote}
        </p>
      </div>
    </div>
  );
};

export default EntryVeil;
