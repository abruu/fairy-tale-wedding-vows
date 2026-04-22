import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { ANIMATION_CONFIG } from '@/config/animations';
import { useScrollReveal } from '@/hooks/useScrollReveal';

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
const AnimatedDigit: React.FC<{ value: string; duration: number }> = ({ value, duration }) => {
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

  if (mode === 'flip') {
    return (
      <span className="countdown-digit-wrapper">
        <span
          className={`countdown-digit ${animating ? 'countdown-digit-flip-out' : 'countdown-digit-flip-in'}`}
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
        transform: animating ? 'translateY(-4px)' : 'translateY(0)',
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
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isComplete, setIsComplete] = useState(false);
  const { ref: revealRef, style: revealStyle } = useScrollReveal<HTMLDivElement>({ animation: 'fade-up' });

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
        days:    Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours:   Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [targetDate, isComplete, onComplete]);

  const fmt = (n: number) => String(n).padStart(2, '0');
  const digitDuration = ANIMATION_CONFIG.countdown.transitionDuration;
  const stagger = ANIMATION_CONFIG.countdown.entranceStagger;

  if (isComplete) {
    return (
      <div className={cn('text-center py-4', className)}>
        <p className="font-serif italic text-xl animate-glow-pulse" style={{ color: '#4A7FC1' }}>
          ✨ United Forever ✨
        </p>
      </div>
    );
  }

  const units = timeLeft.days > 0
    ? [
        { value: timeLeft.days,    label: 'Days'    },
        { value: timeLeft.hours,   label: 'Hours'   },
        { value: timeLeft.minutes, label: 'Minutes' },
        { value: timeLeft.seconds, label: 'Seconds' },
      ]
    : [
        { value: timeLeft.hours,   label: 'Hours'   },
        { value: timeLeft.minutes, label: 'Minutes' },
        { value: timeLeft.seconds, label: 'Seconds' },
      ];

  return (
    <div ref={revealRef} className={cn('space-y-4', className)} style={revealStyle}>
      {label && (
        <p
          className="text-center text-sm font-semibold uppercase tracking-widest"
          style={{
            color: premium ? 'rgba(168,201,230,0.85)' : '#4A7FC1',
            letterSpacing: '0.12em',
            textShadow: premium ? '0 1px 6px rgba(0,0,0,0.3)' : undefined,
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
                'countdown-box flex flex-col items-center justify-center',
                premium ? 'countdown-box-premium' : 'countdown-box-enhanced',
              )}
              style={{
                minWidth: timeLeft.days > 0 ? '4.2rem' : '5rem',
                padding: '1rem 0.75rem',
                borderRadius: premium ? '1rem' : undefined,
                animationDelay: `${i * stagger}ms`,
                animation: `countdown-entrance 0.6s ease-out ${i * stagger}ms both`,
              }}
            >
              <span
                className="countdown-number"
                style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)' }}
              >
                <AnimatedDigit value={fmt(unit.value)} duration={digitDuration} />
              </span>
              <span
                className={cn('mt-1.5 text-xs uppercase tracking-widest font-semibold', premium && 'countdown-label-text')}
                style={{
                  color: premium ? undefined : '#4A7FC1',
                  letterSpacing: '0.1em',
                  textShadow: premium ? '0 1px 6px rgba(0,0,0,0.6)' : undefined,
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
