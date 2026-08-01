import { useEffect } from "react";

/**
 * Locks the document to a single screen for as long as the component is
 * mounted. Restores whatever was there before on unmount so the rest of the
 * app (the full wedding site) keeps scrolling normally.
 */
export const useScrollLock = (): void => {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("cs-lock");
    window.scrollTo(0, 0);
    return () => root.classList.remove("cs-lock");
  }, []);
};
