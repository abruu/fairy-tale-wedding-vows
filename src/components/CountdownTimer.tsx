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
  className 
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();
      
      if (difference <= 0) {
        if (!isComplete) {
          setIsComplete(true);
          if (onComplete) onComplete();
        }
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000)
      };
    };

    // Calculate time left initially
    setTimeLeft(calculateTimeLeft());

    // Update time left every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Clean up on unmount
    return () => clearInterval(timer);
  }, [targetDate, isComplete, onComplete]);

  const formatNumber = (num: number) => String(num).padStart(2, '0');

  return (
    <>
      <div className={cn("space-y-3", className)}>
        <h3 className="text-center text-primary font-medium">{label}</h3>
        {isComplete ? (
          <div className="text-center">
            <p className="text-primary font-medium text-lg">
              {label} has begun! ✨
            </p>
          </div>
        ) : (
          timeLeft.days > 0 || (timeLeft.days === 0 && label.includes("Wedding")) ? (
            <div className="flex justify-center gap-2 sm:gap-5">
              <div className="wedding-card p-2 sm:p-5 text-center min-w-14 sm:min-w-20">
                <div className="text-2xl sm:text-5xl font-serif text-primary">{formatNumber(timeLeft.days)}</div>
                <div className="text-xs sm:text-sm uppercase text-text/70 mt-1 font-medium">Days</div>
              </div>
              <div className="wedding-card p-2 sm:p-5 text-center min-w-14 sm:min-w-20">
                <div className="text-2xl sm:text-5xl font-serif text-primary">{formatNumber(timeLeft.hours)}</div>
                <div className="text-xs sm:text-sm uppercase text-text/70 mt-1 font-medium">Hours</div>
              </div>
              <div className="wedding-card p-2 sm:p-5 text-center min-w-14 sm:min-w-20">
                <div className="text-2xl sm:text-5xl font-serif text-primary">{formatNumber(timeLeft.minutes)}</div>
                <div className="text-xs sm:text-sm uppercase text-text/70 mt-1 font-medium">Mins</div>
              </div>
              <div className="wedding-card p-2 sm:p-5 text-center min-w-14 sm:min-w-20">
                <div className="text-2xl sm:text-5xl font-serif text-primary">{formatNumber(timeLeft.seconds)}</div>
                <div className="text-xs sm:text-sm uppercase text-text/70 mt-1 font-medium">Secs</div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center gap-2 sm:gap-5">
              <div className="wedding-card p-2 sm:p-5 text-center min-w-12 sm:min-w-16">
                <div className="text-xl sm:text-4xl font-serif text-primary">{formatNumber(timeLeft.hours)}</div>
                <div className="text-xs sm:text-sm uppercase text-text/70 mt-1 font-medium">Hours</div>
              </div>
              <div className="wedding-card p-2 sm:p-5 text-center min-w-12 sm:min-w-16">
                <div className="text-xl sm:text-4xl font-serif text-primary">{formatNumber(timeLeft.minutes)}</div>
                <div className="text-xs sm:text-sm uppercase text-text/70 mt-1 font-medium">Mins</div>
              </div>
              <div className="wedding-card p-2 sm:p-5 text-center min-w-12 sm:min-w-16">
                <div className="text-xl sm:text-4xl font-serif text-primary">{formatNumber(timeLeft.seconds)}</div>
                <div className="text-xs sm:text-sm uppercase text-text/70 mt-1 font-medium">Secs</div>
              </div>
            </div>
          )
        )}
      </div>
    </>
  );
};

export default CountdownTimer;
