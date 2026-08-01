import { useEffect, useState } from "react";

export interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  /** True once the target date has passed */
  finished: boolean;
}

const diffToParts = (target: number): CountdownParts => {
  const ms = target - Date.now();
  if (ms <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, finished: true };
  }
  const total = Math.floor(ms / 1000);
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
    finished: false,
  };
};

/**
 * Live countdown to an ISO date string. Recomputes from the real clock every
 * second, so it stays accurate after tab sleep / device suspend.
 */
export const useCountdown = (isoDate: string): CountdownParts => {
  const target = new Date(isoDate).getTime();
  const [parts, setParts] = useState(() => diffToParts(target));

  useEffect(() => {
    setParts(diffToParts(target));
    if (Number.isNaN(target)) return;

    const id = window.setInterval(() => {
      const next = diffToParts(target);
      setParts(next);
      if (next.finished) window.clearInterval(id);
    }, 1000);

    return () => window.clearInterval(id);
  }, [target]);

  return parts;
};
