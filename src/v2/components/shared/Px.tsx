import React from "react";
import { asset, type AssetName } from "@/config/dates";

interface PxProps {
  name: AssetName;
  /** Parallax speed (see lib/parallax.ts). 0 = static. */
  speed: number;
  /** Degrees of rotation per pixel of scroll offset (petals) */
  rotate?: number;
  /** Mirror the art horizontally, vertically or both */
  flip?: "x" | "y" | "xy";
  /** Static horizontal shift kept under the parallax, e.g. "-50%" with left:50% */
  x?: string;
  /** Hero layers load eagerly; everything else lazy-loads */
  eager?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * One decorative parallax layer: <img class="px" data-speed="…">. Purely
 * decorative, so it is hidden from assistive tech and never takes pointer
 * events. Swap SVG → PNG art via ASSET_EXT in config/dates.ts.
 */
export const Px: React.FC<PxProps> = ({ name, speed, rotate, flip, x, eager = false, className = "", style }) => {
  const flipTransform = flip === "x" ? " scale(-1, 1)" : flip === "y" ? " scale(1, -1)" : flip === "xy" ? " scale(-1, -1)" : "";
  return (
    <img
      className={`px ${className}`}
      src={asset(name)}
      alt=""
      aria-hidden="true"
      draggable={false}
      decoding="async"
      loading={eager ? "eager" : "lazy"}
      data-speed={speed}
      data-rotate={rotate}
      data-flip={flip}
      data-x={x}
      // Rest pose before lib/parallax.ts takes over. React leaves this alone on
      // re-render because the value never changes, so it won't fight the JS.
      style={{ ...style, transform: `translate3d(${x ?? "0px"}, 0px, 0)${flipTransform}` }}
    />
  );
};
