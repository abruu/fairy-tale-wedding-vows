import React from "react";
import { Music, Pause, VolumeX } from "lucide-react";
import { useLang } from "../../lib/i18n";
import type { BackgroundMusic } from "../../hooks/useBackgroundMusic";

interface MusicPlayerV2Props {
  music: BackgroundMusic;
}

/**
 * Background-music toggle. The song itself (see useBackgroundMusic) may
 * already be playing by the time this mounts — it's started in the same tap
 * that opens the intro video — so this is a pause/resume control, not the
 * thing that first requests the file.
 */
export const MusicPlayerV2: React.FC<MusicPlayerV2Props> = ({ music }) => {
  const { status, toggle } = music;
  const { t } = useLang();

  const label =
    status === "playing" ? t("music.pause") : status === "unavailable" ? t("music.unavailable") : t("music.play");

  return (
    <button
      type="button"
      className={`v2-fab v2-music-btn ${status}`}
      onClick={toggle}
      aria-label={label}
      aria-pressed={status === "playing"}
      aria-disabled={status === "unavailable"}
      title={label}
    >
      {status === "playing" ? <Pause size={18} /> : status === "unavailable" ? <VolumeX size={18} /> : <Music size={18} />}
      {status === "playing" && <span className="v2-music-ring" aria-hidden="true" />}
    </button>
  );
};
