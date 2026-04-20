import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

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
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDate,
  label,
  onComplete,
  className,
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isComplete, setIsComplete] = useState(false);

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

  if (isComplete) {
    return (
      <div className={cn('text-center py-4', className)}>
        <p className="font-serif italic text-xl" style={{ color: '#B76E79' }}>
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
    <div className={cn('space-y-4', className)}>
      {label && (
        <p
          className="text-center text-sm font-semibold uppercase tracking-widest"
          style={{ color: '#B76E79', letterSpacing: '0.12em' }}
        >
          {label}
        </p>
      )}
      <div className="flex justify-center gap-3 sm:gap-5">
        {units.map((unit, i) => (
          <div
            key={unit.label}
            className="countdown-box flex flex-col items-center justify-center"
            style={{
              minWidth: timeLeft.days > 0 ? '4.5rem' : '5rem',
              padding: '1rem 0.75rem',
              animationDelay: `${i * 0.4}s`,
            }}
          >
            <span
              className="countdown-number"
              style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)' }}
            >
              {fmt(unit.value)}
            </span>
            <span
              className="mt-1.5 text-xs uppercase tracking-widest font-medium"
              style={{ color: '#9D7070', letterSpacing: '0.1em' }}
            >
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountdownTimer;
