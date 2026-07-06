import { useState, useEffect, useRef, useCallback } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isComplete: boolean;
}

export function useCountdown(targetDate: string) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isComplete: false,
  });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onCompleteRef = useRef<(() => void) | null>(null);
  const completedRef = useRef(false);

  const setOnComplete = useCallback((fn: () => void) => {
    onCompleteRef.current = fn;
  }, []);

  useEffect(() => {
    const calc = (): TimeLeft => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) {
        if (!completedRef.current) {
          completedRef.current = true;
          onCompleteRef.current?.();
        }
        return { days: 0, hours: 0, minutes: 0, seconds: 0, isComplete: true };
      }
      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
        isComplete: false,
      };
    };

    setTimeLeft(calc());
    intervalRef.current = setInterval(() => setTimeLeft(calc()), 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [targetDate]);

  return { timeLeft, setOnComplete };
}
