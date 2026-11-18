import { useEffect, useState } from "react";

/** setTimeout's ceiling (~24.8 days); longer delays fire immediately. */
const MAX_DELAY = 2 ** 31 - 1;

/**
 * True once `iso` is in the past. Unlike useCountdown it doesn't tick every
 * second — it sleeps until the moment itself (re-arming in ≤24-day hops,
 * since setTimeout can't wait longer), so a component that only needs
 * "has it happened yet?" isn't re-rendered 60×/minute.
 */
export function useHasPassed(iso: string): boolean {
  const target = new Date(iso).getTime();
  const [passed, setPassed] = useState(() => Date.now() >= target);

  useEffect(() => {
    if (passed) return;
    let timer: ReturnType<typeof setTimeout>;
    const arm = () => {
      const remaining = target - Date.now();
      if (remaining <= 0) {
        setPassed(true);
        return;
      }
      timer = setTimeout(arm, Math.min(remaining, MAX_DELAY));
    };
    arm();
    return () => clearTimeout(timer);
  }, [target, passed]);

  return passed;
}
