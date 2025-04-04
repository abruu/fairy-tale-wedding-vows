
import React, { useEffect, useRef } from 'react';

interface FireworksProps {
  duration?: number;
}

const Fireworks: React.FC<FireworksProps> = ({ duration = 5000 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions to match window size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Firework particle class
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      trail: Array<{x: number, y: number}>;
      opacity: number;
      
      constructor(x: number, y: number, size: number, color: string) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speedX = (Math.random() - 0.5) * 6;
        this.speedY = (Math.random() - 0.5) * 6;
        this.color = color;
        this.trail = [];
        this.opacity = 1;
      }
      
      update() {
        this.opacity -= 0.01;
        this.x += this.speedX;
        this.y += this.speedY;
        this.speedY += 0.05; // gravity
        if (this.trail.length > 5) this.trail.shift();
        this.trail.push({x: this.x, y: this.y});
      }
      
      draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Create fireworks
    const createFirework = (x: number, y: number) => {
      const hue = Math.floor(Math.random() * 360);
      const particleCount = 100;
      const particles: Particle[] = [];
      
      for (let i = 0; i < particleCount; i++) {
        const colors = [
          `hsl(${hue}, 100%, 70%)`,
          `hsl(${(hue + 120) % 360}, 100%, 70%)`,
          `hsl(${(hue + 240) % 360}, 100%, 70%)`
        ];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        particles.push(new Particle(x, y, Math.random() * 2 + 1, randomColor));
      }
      
      return particles;
    };
    
    let particles: Particle[] = [];
    
    // Launch multiple fireworks
    const launchFireworks = () => {
      // Create 5 fireworks at random positions across the screen
      for (let i = 0; i < 5; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height * 0.5;
        particles = [...particles, ...createFirework(x, y)];
      }
    };
    
    // Initial fireworks
    launchFireworks();
    
    // Launch more fireworks every 800ms
    const intervalId = setInterval(launchFireworks, 800);
    
    // Animation loop
    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      particles = particles.filter(particle => particle.opacity > 0);
      particles.forEach(particle => {
        particle.update();
        particle.draw(ctx);
      });
      
      const animationId = requestAnimationFrame(animate);
      
      // If no particles left, stop animation
      if (particles.length === 0) {
        cancelAnimationFrame(animationId);
      }
    };
    
    const animationId = requestAnimationFrame(animate);
    
    // Set a timeout to remove the fireworks after the specified duration
    const timeoutId = setTimeout(() => {
      clearInterval(intervalId);
    }, duration);
    
    return () => {
      cancelAnimationFrame(animationId);
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, [duration]);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-50"
      style={{ background: 'transparent' }}
    />
  );
};

export default Fireworks;
