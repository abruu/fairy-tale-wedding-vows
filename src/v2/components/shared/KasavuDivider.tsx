import React from "react";
import { asset } from "@/config/dates";

/**
 * Tileable kasavu (gold zari on cream) strip placed between sections.
 * The art comes from the same ASSET_EXT switch as the parallax layers.
 */
export const KasavuDivider: React.FC = () => (
  <div
    className="v2-kasavu"
    aria-hidden="true"
    style={{ backgroundImage: `url(${asset("kasavu-border")})` }}
  />
);
