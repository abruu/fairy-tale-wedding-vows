// Wedding event configuration — ALL content is driven from this config
export const WEDDING_CONFIG = {
  // ─── Couple & Content ───
  couple: {
    name1: "Daril",
    name2: "Sneha",
    /** Short display (hero heading) */
    displayNames: "Daril & Sneha",
    /** Hero tagline above names */
    tagline: "Wedding Invitation",
    /** Primary wedding message */
    weddingMessage: "We are getting married",
    /** Supporting sub-message */
    supportingMessage: "Join us to celebrate our special day",
    /** Venue line shown under date */
    venue: "St. George Shrine Church · Kulathuvayal",
  },

  // ─── Event Dates (ISO with timezone) ───
  dates: {
    engagement: "2026-05-26T17:00:00+05:30", // 26th May 2026, 5:00 PM IST
    wedding: "2026-08-28T10:39:00+05:30", // 28th August 2026, 10:39 AM IST
  },

  // ─── Countdown Behaviour ───
  countdown: {
    /** Style: "premium" | "minimal" */
    style: "premium" as "premium" | "minimal",
    /** Labels for countdown */
    engagementLabel: "Countdown to Betrothal",
    weddingLabel: "Countdown to Our Wedding",
    /** Show dual-event timeline indicator on hero */
    showDualEventTimeline: true,
    /** Engagement event label in timeline */
    engagementTimelineLabel: "Betrothal",
    /** Wedding event label in timeline */
    weddingTimelineLabel: "Wedding",
  },

  // ─── Text Overlay / Visibility ───
  textOverlay: {
    /** Hero overlay gradient — strengthened for readability */
    heroGradient:
      "linear-gradient(to bottom, rgba(10,5,5,0.65) 0%, rgba(10,5,5,0.35) 35%, rgba(10,5,5,0.50) 65%, rgba(10,5,5,0.75) 100%)",
    /** Glass effect behind hero text block */
    heroGlass: {
      enabled: false,
      background: "rgba(10, 5, 5, 0.30)",
      blur: 12, // px
      borderRadius: 24, // px
      border: "1px solid rgba(230,203,168,0.15)",
    },
    /** Text shadow for hero text */
    textShadow: "0 2px 24px rgba(0,0,0,0.6), 0 4px 48px rgba(0,0,0,0.35)",
    /** Name-specific stronger shadow */
    nameShadow: "0 2px 28px rgba(0,0,0,0.65), 0 6px 52px rgba(0,0,0,0.4)",
  },

  // ─── Media Configuration ───
  media: {
    youtubeUrl: "https://www.youtube.com/embed/hkr1mwkigxY?autoplay=1",
    musicUrl: "/music/msuic1.mp3",
    fireworks: {
      duration: 50000,
      intensity: 7,
      startDelay: 500,
    },
  },

  // ─── Feature Flags ───
  features: {
    autoPlayMusic: true,
    showFireworks: false,
    showVideo: false,
    /** Enable parallax on hero section */
    heroParallax: true,
    /** Enable floating decorations */
    floatingDecorations: true,

    countdownTriggers: {
      enabled: true,
      showFireworks: true,
      showVideo: true,
      fireworksDuration: 60000,
    },
  },
};
