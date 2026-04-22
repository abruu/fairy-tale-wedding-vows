/**
 * Animation & Parallax Configuration
 * All motion values are driven from this JSON-like config.
 * No hardcoded animation values elsewhere in the codebase.
 */

export const ANIMATION_CONFIG = {
  /** Global toggle — set false to disable all enhancements at once */
  enabled: true,

  /** Reduce / disable heavy effects on mobile (<768 px) */
  mobile: {
    disableParallax: true,
    reduceFloatingElements: true,
    maxFloatingElements: 6,
    reduceParticleCount: true,
  },

  /* ───────────────────── Parallax ───────────────────── */
  parallax: {
    enabled: true,
    /** Speed multipliers (0 = no movement, 1 = scroll-speed) */
    layers: {
      background: 0.15, // slow — deep background
      midground: 0.35, // medium — decorative accents
      foreground: 0.55, // faster — text / headings float up
    },
    /** Max pixel offset so elements never drift too far */
    maxOffset: 120,
    /** Smooth interpolation factor (0–1, lower = smoother) */
    smoothing: 0.08,
  },

  /* ───────────────────── Scroll Reveal ───────────────────── */
  scrollReveal: {
    enabled: true,
    /** Viewport fraction before triggering (0–1) */
    threshold: 0.15,
    /** Root margin for IntersectionObserver */
    rootMargin: "0px 0px -60px 0px",
    /** Default animation */
    defaultAnimation: "fade-up" as const,
    /** Duration in ms */
    duration: 800,
    /** Stagger delay between sibling items (ms) */
    staggerDelay: 100,
    /** Only animate once */
    once: true,
  },

  /* ───────────────────── Floating Decorative Elements ───────────────────── */
  floatingElements: {
    enabled: true,
    flowers: {
      enabled: true,
      count: 5,
      emoji: "🌸",
      sizeRange: [16, 28],
      durationRange: [18, 30], // seconds
      opacityRange: [0.25, 0.5],
    },
    leaves: {
      enabled: true,
      count: 4,
      emoji: "🍃",
      sizeRange: [14, 22],
      durationRange: [20, 35],
      opacityRange: [0.2, 0.4],
    },
    sparkles: {
      enabled: true,
      count: 6,
      emoji: "✨",
      sizeRange: [10, 18],
      durationRange: [14, 24],
      opacityRange: [0.3, 0.55],
    },
  },

  /* ───────────────────── Micro-animations ───────────────────── */
  microAnimations: {
    enabled: true,
    /** Button hover: scale + glow */
    buttonHover: {
      scale: 1.04,
      glowColor: "rgba(74,127,193,0.4)",
      glowSize: "0 0 20px",
      duration: 300,
    },
    /** Soft pulsing glow on important elements */
    glowPulse: {
      enabled: true,
      color: "rgba(74,127,193,0.3)",
      duration: 2500,
    },
    /** Card hover lift */
    cardHover: {
      translateY: -6,
      shadowSpread: 20,
      duration: 350,
    },
  },

  /* ───────────────────── Countdown Animation ───────────────────── */
  countdown: {
    /** "flip" | "fade" */
    digitTransition: "fade" as "flip" | "fade",
    /** Duration of digit change animation (ms) */
    transitionDuration: 400,
    /** Entrance animation delay per box (ms) */
    entranceStagger: 120,
  },

  /* ───────────────────── Gallery ───────────────────── */
  gallery: {
    /** Horizontal auto-slide */
    autoSlide: {
      enabled: true,
      speed: 35, // px per second
      direction: "left" as "left" | "right",
      pauseOnHover: true,
    },
    /** Parallax depth: images move at slightly different speeds */
    parallaxDepth: {
      enabled: true,
      /** Offset multiplier per image index */
      speedVariance: 0.04,
    },
    /** Scale on focus / hover */
    focusScale: 1.05,
    /** Light shimmer overlay */
    shimmerOverlay: true,
  },

  /* ───────────────────── Wishes / RSVP ───────────────────── */
  wishes: {
    /** Cards float up when revealed */
    floatUp: {
      enabled: true,
      distance: 40, // px
      duration: 700,
    },
    /** New wish animate in */
    newWishAnimation: {
      type: "fade-up" as const,
      duration: 600,
    },
  },

  /* ───────────────────── Section Transitions ───────────────────── */
  sectionTransitions: {
    /** Depth shift between consecutive sections */
    depthShift: {
      enabled: true,
      offset: 30, // px
    },
    /** Fade + slide-up for section content */
    fadeSlideUp: {
      distance: 50,
      duration: 900,
      easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    },
  },
} as const;

export type AnimationConfig = typeof ANIMATION_CONFIG;
