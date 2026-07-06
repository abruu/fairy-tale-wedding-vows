import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Heart, Sparkles } from "lucide-react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface HeaderCountdownProps {
  /** Wedding target date (ISO) */
  targetDate: string;
  /** Whether engagement is complete — header only shows after this */
  engagementComplete: boolean;
  /** Fired when the wedding countdown reaches zero */
  onWeddingComplete?: () => void;
}

const fmt = (n: number) => String(n).padStart(2, "0");

const HeaderCountdown: React.FC<HeaderCountdownProps> = ({
  targetDate,
  engagementComplete,
  onWeddingComplete,
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isComplete, setIsComplete] = useState(false);
  const [visible, setVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const completedRef = useRef(false);

  // Determine if wedding date has already passed on mount
  useEffect(() => {
    if (new Date(targetDate).getTime() - Date.now() <= 0) {
      setIsComplete(true);
      completedRef.current = true;
    }
  }, [targetDate]);

  // Countdown ticker
  useEffect(() => {
    if (!engagementComplete || isComplete) return;

    const calc = (): TimeLeft => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) {
        if (!completedRef.current) {
          completedRef.current = true;
          setIsComplete(true);
          onWeddingComplete?.();
        }
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      };
    };

    setTimeLeft(calc());
    const iv = setInterval(() => setTimeLeft(calc()), 1000);
    return () => clearInterval(iv);
  }, [targetDate, engagementComplete, isComplete, onWeddingComplete]);

  // Animate in when engagement completes
  useEffect(() => {
    if (engagementComplete) {
      const t = setTimeout(() => setVisible(true), 50);
      return () => clearTimeout(t);
    }
    setVisible(false);
  }, [engagementComplete]);

  // Track scroll to condense the bar
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 120);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!engagementComplete) return null;

  const units = [
    { value: timeLeft.days, label: "Days" },
    { value: timeLeft.hours, label: "Hrs" },
    { value: timeLeft.minutes, label: "Min" },
    { value: timeLeft.seconds, label: "Sec" },
  ];

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-500 ease-out",
        visible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0",
      )}
      style={{
        background: scrolled ? "rgba(10,20,45,0.92)" : "rgba(10,20,45,0.72)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(168,201,230,0.35)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.35)",
      }}
    >
      <div
        className={cn(
          "mx-auto flex items-center justify-center gap-3 px-4 transition-all duration-300",
          scrolled ? "py-1.5" : "py-2.5",
        )}
        style={{ maxWidth: "max-content" }}
      >
        {isComplete ? (
          /* ── United Forever state ── */
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Left sparkle */}
            <Sparkles
              size={scrolled ? 13 : 16}
              className="animate-sparkle-twinkle"
              style={{
                color: "#E6C3D5",
                filter: "drop-shadow(0 0 4px rgba(230,195,213,0.7))",
              }}
            />
            {/* Left divider */}
            <div
              style={{
                width: scrolled ? 16 : 24,
                height: "1px",
                background:
                  "linear-gradient(90deg, transparent, rgba(230,195,213,0.6))",
              }}
            />
            {/* Main text — gradient shimmer */}
            <span
              className="font-serif italic animate-united-glow whitespace-nowrap"
              style={{
                fontSize: scrolled ? "0.9rem" : "clamp(1.05rem, 2.8vw, 1.4rem)",
                letterSpacing: "0.08em",
                background:
                  "linear-gradient(90deg, #E6C3D5 0%, #A8C9E6 25%, #ffffff 50%, #A8C9E6 75%, #E6C3D5 100%)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                animation:
                  "united-shimmer 3s ease-in-out infinite, united-glow 2.5s ease-in-out infinite",
              }}
            >
              United Forever
            </span>
            {/* Right divider */}
            <div
              style={{
                width: scrolled ? 16 : 24,
                height: "1px",
                background:
                  "linear-gradient(90deg, rgba(230,195,213,0.6), transparent)",
              }}
            />
            {/* Right sparkle */}
            <Sparkles
              size={scrolled ? 13 : 16}
              className="animate-sparkle-twinkle"
              style={{
                color: "#E6C3D5",
                filter: "drop-shadow(0 0 4px rgba(230,195,213,0.7))",
                animationDelay: "1s",
              }}
            />
          </div>
        ) : (
          /* ── Countdown state ── */
          <>
            <Heart
              size={scrolled ? 12 : 14}
              fill="#A8C9E6"
              style={{ color: "#A8C9E6", flexShrink: 0 }}
            />
            <span
              className="hidden sm:inline text-[0.65rem] uppercase tracking-[0.18em] font-semibold whitespace-nowrap"
              style={{ color: "rgba(197,224,255,0.85)" }}
            >
              Wedding in
            </span>
            <div className="flex items-center gap-1 sm:gap-1.5">
              {units.map((u, i) => (
                <React.Fragment key={u.label}>
                  <div className="flex flex-col items-center leading-none">
                    <span
                      className="font-serif font-bold tabular-nums"
                      style={{
                        fontSize: scrolled
                          ? "0.85rem"
                          : "clamp(0.9rem, 2vw, 1.15rem)",
                        color: "#fff",
                        background:
                          "linear-gradient(135deg, #ffffff 0%, #C5E0FF 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        filter: "drop-shadow(0 0 4px rgba(165,210,255,0.5))",
                      }}
                    >
                      {fmt(u.value)}
                    </span>
                    <span
                      className="text-[0.5rem] uppercase tracking-wider mt-0.5"
                      style={{ color: "rgba(197,224,255,0.7)" }}
                    >
                      {u.label}
                    </span>
                  </div>
                  {i < units.length - 1 && (
                    <span
                      className="font-serif font-bold"
                      style={{
                        color: "rgba(168,201,230,0.6)",
                        fontSize: scrolled ? "0.8rem" : "1rem",
                        marginBottom: "0.6rem",
                      }}
                    >
                      :
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HeaderCountdown;
