import React, { useState, useEffect, useRef } from "react";
import { Sparkles, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { ANIMATION_CONFIG } from "@/config/animations";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownTimerProps {
  targetDate: string;
  label: string;
  onComplete?: () => void;
  className?: string;
  /** When true, uses the premium hero-aware glass style */
  premium?: boolean;
}

/** Animated digit with fade/flip transition */
const AnimatedDigit: React.FC<{ value: string; duration: number }> = ({
  value,
  duration,
}) => {
  const [display, setDisplay] = useState(value);
  const [animating, setAnimating] = useState(false);
  const prevRef = useRef(value);

  useEffect(() => {
    if (prevRef.current !== value) {
      setAnimating(true);
      const timer = setTimeout(() => {
        setDisplay(value);
        setAnimating(false);
      }, duration / 2);
      prevRef.current = value;
      return () => clearTimeout(timer);
    }
  }, [value, duration]);

  const mode = ANIMATION_CONFIG.countdown.digitTransition;

  if (mode === "flip") {
    return (
      <span className="countdown-digit-wrapper">
        <span
          className={`countdown-digit ${animating ? "countdown-digit-flip-out" : "countdown-digit-flip-in"}`}
          style={{ animationDuration: `${duration / 2}ms` }}
        >
          {display}
        </span>
      </span>
    );
  }

  // fade (default)
  return (
    <span
      className="countdown-digit"
      style={{
        opacity: animating ? 0.3 : 1,
        transform: animating ? "translateY(-4px)" : "translateY(0)",
        transition: `opacity ${duration / 2}ms ease, transform ${duration / 2}ms ease`,
      }}
    >
      {display}
    </span>
  );
};

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDate,
  label,
  onComplete,
  className,
  premium = false,
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isComplete, setIsComplete] = useState(() => {
    const difference = new Date(targetDate).getTime() - Date.now();
    return difference <= 0;
  });
  const { ref: revealRef, style: revealStyle } =
    useScrollReveal<HTMLDivElement>({ animation: "fade-up" });

  useEffect(() => {
    const calculateTimeLeft = (): TimeLeft => {
      const difference = new Date(targetDate).getTime() - Date.now();
      if (difference <= 0) {
        if (!isComplete) {
          setIsComplete(true);
          onComplete?.();
        }
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        ),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [targetDate, isComplete, onComplete]);

  const fmt = (n: number) => String(n).padStart(2, "0");
  const digitDuration = ANIMATION_CONFIG.countdown.transitionDuration;
  const stagger = ANIMATION_CONFIG.countdown.entranceStagger;

  if (isComplete) {
    return (
      <div
        className={cn("text-center py-6 px-4", className)}
        style={{
          animation: "scale-in 0.6s ease-out both",
        }}
      >
        <div
          className="flex flex-col items-center gap-3"
          style={{
            animation: "fade-up 0.8s ease-out 0.2s both",
          }}
        >
          {/* Top ornament line with sparkle */}
          <div className="flex items-center justify-center gap-3">
            <div
              style={{
                width: 40,
                height: "1px",
                background: premium
                  ? "linear-gradient(90deg, transparent, rgba(230,195,213,0.7))"
                  : "linear-gradient(90deg, transparent, rgba(74,127,193,0.4))",
              }}
            />
            <Sparkles
              size={14}
              className="animate-sparkle-twinkle"
              style={{
                color: premium ? "#E6C3D5" : "#4A7FC1",
                filter: premium
                  ? "drop-shadow(0 0 6px rgba(230,195,213,0.7))"
                  : "drop-shadow(0 0 4px rgba(74,127,193,0.4))",
              }}
            />
            <div
              style={{
                width: 40,
                height: "1px",
                background: premium
                  ? "linear-gradient(90deg, rgba(230,195,213,0.7), transparent)"
                  : "linear-gradient(90deg, rgba(74,127,193,0.4), transparent)",
              }}
            />
          </div>

          {/* Main text — gradient shimmer */}
          <p
            className="font-serif italic"
            style={{
              fontSize: "clamp(1.4rem, 4vw, 2rem)",
              letterSpacing: "0.1em",
              margin: 0,
              background: premium
                ? "linear-gradient(90deg, #E6C3D5 0%, #A8C9E6 25%, #ffffff 50%, #A8C9E6 75%, #E6C3D5 100%)"
                : "linear-gradient(90deg, #4A7FC1 0%, #7BB8D6 25%, #4A7FC1 50%, #7BB8D6 75%, #4A7FC1 100%)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation:
                "united-shimmer 3s ease-in-out infinite, united-glow 2.5s ease-in-out infinite",
            }}
          >
            United Forever
          </p>

          {/* Heart + sparkle row */}
          {/* <div className="flex items-center justify-center gap-2">
            <Heart
              size={12}
              fill={premium ? "#E6C3D5" : "#4A7FC1"}
              style={{
                color: premium ? "#E6C3D5" : "#4A7FC1",
                animation: "heartbeat 2.2s ease-in-out infinite",
              }}
            />
            <span
              className="text-[0.6rem] uppercase tracking-[0.3em] font-semibold"
              style={{
                color: premium
                  ? "rgba(230,195,213,0.8)"
                  : "rgba(74,127,193,0.6)",
              }}
            >
              Alex &amp; Mariyam
            </span>
            <Heart
              size={12}
              fill={premium ? "#E6C3D5" : "#4A7FC1"}
              style={{
                color: premium ? "#E6C3D5" : "#4A7FC1",
                animation: "heartbeat 2.2s ease-in-out infinite 1.1s",
              }}
            />
          </div> */}

          {/* Bottom ornament line with sparkle */}
          <div className="flex items-center justify-center gap-3">
            <div
              style={{
                width: 40,
                height: "1px",
                background: premium
                  ? "linear-gradient(90deg, transparent, rgba(230,195,213,0.7))"
                  : "linear-gradient(90deg, transparent, rgba(74,127,193,0.4))",
              }}
            />
            <Sparkles
              size={14}
              className="animate-sparkle-twinkle"
              style={{
                color: premium ? "#E6C3D5" : "#4A7FC1",
                filter: premium
                  ? "drop-shadow(0 0 6px rgba(230,195,213,0.7))"
                  : "drop-shadow(0 0 4px rgba(74,127,193,0.4))",
                animationDelay: "1s",
              }}
            />
            <div
              style={{
                width: 40,
                height: "1px",
                background: premium
                  ? "linear-gradient(90deg, rgba(230,195,213,0.7), transparent)"
                  : "linear-gradient(90deg, rgba(74,127,193,0.4), transparent)",
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  const units =
    timeLeft.days > 0
      ? [
          { value: timeLeft.days, label: "Days" },
          { value: timeLeft.hours, label: "Hours" },
          { value: timeLeft.minutes, label: "Min" },
          { value: timeLeft.seconds, label: "Sec" },
        ]
      : [
          { value: timeLeft.hours, label: "Hours" },
          { value: timeLeft.minutes, label: "Min" },
          { value: timeLeft.seconds, label: "Sec" },
        ];

  return (
    <div
      ref={revealRef}
      className={cn("space-y-4", className)}
      style={revealStyle}
    >
      {label && (
        <p
          className="text-center text-sm font-semibold uppercase tracking-widest"
          style={{
            color: premium ? "rgba(168,201,230,0.85)" : "#4A7FC1",
            letterSpacing: "0.12em",
            textShadow: premium ? "0 1px 6px rgba(0,0,0,0.3)" : undefined,
          }}
        >
          {label}
        </p>
      )}
      <div className="flex justify-center items-start gap-1 sm:gap-2">
        {units.map((unit, i) => (
          <React.Fragment key={unit.label}>
            <div
              className={cn(
                "countdown-box flex flex-col items-center justify-center",
                premium ? "countdown-box-premium" : "countdown-box-enhanced",
              )}
              style={{
                minWidth: timeLeft.days > 0 ? "4.2rem" : "5rem",
                padding: "1rem 0.75rem",
                borderRadius: premium ? "1rem" : undefined,
                animationDelay: `${i * stagger}ms`,
                animation: `countdown-entrance 0.6s ease-out ${i * stagger}ms both`,
              }}
            >
              <span
                className="countdown-number"
                style={{ fontSize: "clamp(1.8rem, 5vw, 3rem)" }}
              >
                <AnimatedDigit
                  value={fmt(unit.value)}
                  duration={digitDuration}
                />
              </span>
              <span
                className={cn(
                  "mt-1.5 text-xs uppercase tracking-widest font-semibold",
                  premium && "countdown-label-text",
                )}
                style={{
                  color: premium ? undefined : "#4A7FC1",
                  letterSpacing: "0.1em",
                  textShadow: premium ? "0 1px 6px rgba(0,0,0,0.6)" : undefined,
                }}
              >
                {unit.label}
              </span>
            </div>
            {/* Separator between units */}
            {i < units.length - 1 && (
              <div className="countdown-separator">:</div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default CountdownTimer;
