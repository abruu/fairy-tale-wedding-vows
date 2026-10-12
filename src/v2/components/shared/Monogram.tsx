import React from "react";
import { couplePeople } from "../../lib/couple";

interface MonogramProps {
  /** Diameter in px */
  size?: number;
  className?: string;
}

/** The couple's initials ("A & A") in a thin champagne circle. */
export const Monogram: React.FC<MonogramProps> = ({ size = 64, className = "" }) => {
  const [first, second] = couplePeople("en");
  return (
    <span
      className={`v2-monogram ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.34 }}
      lang="en"
      aria-hidden="true"
    >
      {first.nameEn[0]}
      <i>&amp;</i>
      {second.nameEn[0]}
    </span>
  );
};
