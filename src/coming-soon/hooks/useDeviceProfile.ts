import { useEffect, useState } from "react";
import { useReducedMotion } from "./useReducedMotion";

export interface DeviceProfile {
  /** Drop decorative motion entirely (reduced motion or low-power device) */
  calm: boolean;
  /** Simplified effects: fewer particles, no foreground blur layer */
  light: boolean;
  /** Pointer glow + sparkles are worth running */
  magic: boolean;
}

const isLowPower = () => {
  const nav = navigator as Navigator & { deviceMemory?: number };
  if (typeof nav.deviceMemory === "number" && nav.deviceMemory <= 2) return true;
  if (typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency <= 2)
    return true;
  return false;
};

const readProfile = (reduced: boolean): DeviceProfile => {
  if (typeof window === "undefined") {
    return { calm: true, light: true, magic: false };
  }
  const small = window.matchMedia("(max-width: 640px)").matches;
  const low = isLowPower();

  // The pointer trail is fine-pointer only; touch devices still get the tap
  // sparkle, which `CursorMagic` handles internally.
  return {
    calm: reduced || low,
    light: small || low,
    magic: !reduced && !low,
  };
};

/**
 * Decides how much decoration this device should carry. Re-evaluated on resize
 * and orientation change so rotating a phone lands on the right profile.
 */
export const useDeviceProfile = (): DeviceProfile => {
  const reduced = useReducedMotion();
  const [profile, setProfile] = useState(() => readProfile(reduced));

  useEffect(() => {
    const update = () => setProfile(readProfile(reduced));
    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, [reduced]);

  return profile;
};

export default useDeviceProfile;
