import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Wedding palette — hex values so opacity modifiers (/70 etc.) work
        text: "#3E4E6A",
        heading: "#1E3A6E",
        // Semantic wedding colours
        "blush-pink": "#C5E0FF",
        "champagne-gold": "#A8C9E6",
        "rose-gold": "#4A7FC1",
        "sage-green": "#7BB8D6",
        "soft-peach": "#C5DFFF",
        ivory: "#F0F7FF",
        charcoal: "#3A3A3A",
        "deep-brown": "#1E3A6E",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-6deg)" },
          "25%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
          "75%": { transform: "rotate(6deg)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "33%": { transform: "translateY(-12px) rotate(4deg)" },
          "66%": { transform: "translateY(-6px) rotate(-3deg)" },
        },
        "petal-fall": {
          "0%": { transform: "translateY(-30px) rotateZ(0deg)", opacity: "0" },
          "5%": { opacity: "0.85" },
          "90%": { opacity: "0.5" },
          "100%": {
            transform: "translateY(110vh) rotateZ(720deg)",
            opacity: "0",
          },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.7", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.06)" },
        },
        heartbeat: {
          "0%, 100%": { transform: "scale(1)" },
          "10%": { transform: "scale(1.18)" },
          "20%": { transform: "scale(1)" },
          "30%": { transform: "scale(1.1)" },
          "40%": { transform: "scale(1)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(40px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-in-left": {
          "0%": { opacity: "0", transform: "translateX(-30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.85)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "wave-bar": {
          "0%, 100%": { transform: "scaleY(0.4)" },
          "50%": { transform: "scaleY(1)" },
        },
        "scroll-dot": {
          "0%": { transform: "translateY(0)", opacity: "1" },
          "100%": { transform: "translateY(8px)", opacity: "0" },
        },
        "reveal-clip": {
          "0%": { clipPath: "inset(0 100% 0 0)" },
          "100%": { clipPath: "inset(0 0% 0 0)" },
        },
        "countdown-entrance": {
          "0%": { opacity: "0", transform: "translateY(20px) scale(0.9)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "united-shimmer": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "sparkle-twinkle": {
          "0%, 100%": { opacity: "0.3", transform: "scale(0.8) rotate(0deg)" },
          "50%": { opacity: "1", transform: "scale(1.2) rotate(180deg)" },
        },
        "united-glow": {
          "0%, 100%": {
            textShadow:
              "0 0 10px rgba(230,195,213,0.5), 0 0 20px rgba(168,201,230,0.3)",
          },
          "50%": {
            textShadow:
              "0 0 18px rgba(230,195,213,0.8), 0 0 36px rgba(168,201,230,0.6), 0 0 54px rgba(230,195,213,0.3)",
          },
        },
        "floating-drift": {
          "0%": {
            transform: "translateY(0) translateX(0) rotate(0deg) scale(1)",
            opacity: "0",
          },
          "5%": { opacity: "0.4" },
          "25%": {
            transform:
              "translateY(-40px) translateX(15px) rotate(45deg) scale(1.05)",
          },
          "50%": {
            transform:
              "translateY(-20px) translateX(-10px) rotate(90deg) scale(0.95)",
          },
          "75%": {
            transform:
              "translateY(-60px) translateX(20px) rotate(180deg) scale(1.02)",
          },
          "95%": { opacity: "0.4" },
          "100%": {
            transform:
              "translateY(-80px) translateX(-5px) rotate(360deg) scale(1)",
            opacity: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        wiggle: "wiggle 5s ease-in-out infinite",
        "wiggle-delay": "wiggle 5s ease-in-out 1s infinite",
        "wiggle-delay-2": "wiggle 5s ease-in-out 2s infinite",
        float: "float 6s ease-in-out infinite",
        "float-slow": "float 9s ease-in-out infinite",
        "petal-fall": "petal-fall 10s linear infinite",
        shimmer: "shimmer 4s linear infinite",
        "glow-pulse": "glow-pulse 2.5s ease-in-out infinite",
        heartbeat: "heartbeat 2.2s ease-in-out infinite",
        "fade-up": "fade-up 0.8s ease-out forwards",
        "fade-in": "fade-in 0.6s ease-out forwards",
        "slide-in-left": "slide-in-left 0.6s ease-out forwards",
        "scale-in": "scale-in 0.5s ease-out forwards",
        "wave-bar": "wave-bar 1s ease-in-out infinite",
        "scroll-dot": "scroll-dot 1.5s ease-in-out infinite",
        "countdown-entrance": "countdown-entrance 0.6s ease-out forwards",
        "floating-drift": "floating-drift 20s linear infinite",
        "united-shimmer": "united-shimmer 3s ease-in-out infinite",
        "sparkle-twinkle": "sparkle-twinkle 2s ease-in-out infinite",
        "united-glow": "united-glow 2.5s ease-in-out infinite",
      },
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
        sans: ["Montserrat", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
