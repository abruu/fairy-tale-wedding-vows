import React, { useEffect, useRef, useState } from 'react';
import { Fireworks } from 'fireworks-js';
import type { FireworksOptions } from 'fireworks-js';

interface BirthdayFireworksProps {
  duration?: number;
  startDelay?: number;
  autoStart?: boolean;
  intensity?: number;
}

const BirthdayFireworks: React.FC<BirthdayFireworksProps> = ({
  duration = 10000,
  startDelay = 0,
  autoStart = true,
  intensity = 4
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const fireworksInstanceRef = useRef<Fireworks | null>(null);
  const [isActive, setIsActive] = useState(autoStart);
  const [timeRemaining, setTimeRemaining] = useState(duration);

  // Function to start the fireworks manually
  const startFireworks = () => {
    setIsActive(true);
    setTimeRemaining(duration);
    if (fireworksInstanceRef.current) {
      fireworksInstanceRef.current.start();
    }
  };

  // Function to stop the fireworks manually
  const stopFireworks = () => {
    setIsActive(false);
    if (fireworksInstanceRef.current) {
      fireworksInstanceRef.current.stop();
    }
  };

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    // Configure fireworks options
    const options: FireworksOptions = {
      autoresize: true,
      opacity: 0.5,
      acceleration: 1.05,
      friction: 0.97,
      gravity: 1.5,
      particles: 50 * intensity,
      traceLength: 3,
      traceSpeed: 10,
      explosion: 5,
      intensity: intensity,
      flickering: 50,
      lineStyle: 'round',
      hue: {
        min: 0,
        max: 360
      },
      delay: {
        min: 30,
        max: 60
      },
      rocketsPoint: {
        min: 0,
        max: 100
      },
      lineWidth: {
        explosion: {
          min: 1,
          max: 3
        },
        trace: {
          min: 1,
          max: 2
        }
      },
      brightness: {
        min: 50,
        max: 80
      },
      decay: {
        min: 0.015,
        max: 0.03
      },
      mouse: {
        click: true,
        move: false,
        max: 1
      }
    };

    // Initialize fireworks
    const fireworks = new Fireworks(containerRef.current, options);
    fireworksInstanceRef.current = fireworks;

    // Add a delay before starting if specified
    const startTimerId = setTimeout(() => {
      // Start the fireworks
      fireworks.start();

      // Update the time remaining
      const timerInterval = setInterval(() => {
        setTimeRemaining(prev => {
          const newTime = prev - 100;
          if (newTime <= 0) {
            clearInterval(timerInterval);
            stopFireworks();
            return 0;
          }
          return newTime;
        });
      }, 100);

      // Set a timeout to stop the fireworks after the specified duration
      const timeoutId = setTimeout(() => {
        fireworks.stop();
        setIsActive(false);
        clearInterval(timerInterval);
      }, duration);

      // Cleanup function
      return () => {
        fireworks.stop();
        clearTimeout(timeoutId);
        clearInterval(timerInterval);
      };
    }, startDelay);

    // Cleanup function
    return () => {
      clearTimeout(startTimerId);
      if (fireworksInstanceRef.current) {
        fireworksInstanceRef.current.stop();
      }
    };
  }, [isActive, duration, startDelay, intensity]);

  // Expose the control functions
  (window as any).fireworksControl = {
    start: startFireworks,
    stop: stopFireworks,
    getTimeRemaining: () => timeRemaining
  };

  return (
    <>
      {isActive && (
        <div
          ref={containerRef}
          className="fixed inset-0 z-50 pointer-events-none"
          style={{
            margin: 0,
            background: 'transparent',
            cursor: 'crosshair',
            width: '100%',
            height: '100%'
          }}
        />
      )}
    </>
  );
};

export default BirthdayFireworks;
