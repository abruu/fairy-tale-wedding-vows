
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
        setIsComplete(true);
        if (onComplete) onComplete();
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000)
      };
    };

    setTimeLeft(calculateTimeLeft());
    
    const timer = setInterval(() => {
      const calculated = calculateTimeLeft();
      setTimeLeft(calculated);
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onComplete]);

  const formatNumber = (num: number) => String(num).padStart(2, '0');

  if (isComplete) {
    return (
      <div className={cn("text-center", className)}>
        <p className="text-primary font-medium text-lg">
          {label} has begun! ✨
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      <h3 className="text-center text-primary font-medium">{label}</h3>
      <div className="flex justify-center gap-2 sm:gap-4">
        <div className="bg-background/80 backdrop-blur-sm p-2 sm:p-3 rounded-lg text-center min-w-16 shadow-md border border-accent/30">
          <div className="text-2xl sm:text-3xl font-serif text-primary">{formatNumber(timeLeft.days)}</div>
          <div className="text-xs uppercase text-text/70 mt-1">Days</div>
        </div>
        <div className="bg-background/80 backdrop-blur-sm p-2 sm:p-3 rounded-lg text-center min-w-16 shadow-md border border-accent/30">
          <div className="text-2xl sm:text-3xl font-serif text-primary">{formatNumber(timeLeft.hours)}</div>
          <div className="text-xs uppercase text-text/70 mt-1">Hours</div>
        </div>
        <div className="bg-background/80 backdrop-blur-sm p-2 sm:p-3 rounded-lg text-center min-w-16 shadow-md border border-accent/30">
          <div className="text-2xl sm:text-3xl font-serif text-primary">{formatNumber(timeLeft.minutes)}</div>
          <div className="text-xs uppercase text-text/70 mt-1">Mins</div>
        </div>
        <div className="bg-background/80 backdrop-blur-sm p-2 sm:p-3 rounded-lg text-center min-w-16 shadow-md border border-accent/30">
          <div className="text-2xl sm:text-3xl font-serif text-primary">{formatNumber(timeLeft.seconds)}</div>
          <div className="text-xs uppercase text-text/70 mt-1">Secs</div>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
