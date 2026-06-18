// Wedding event configuration — ALL content is driven from this config
export const WEDDING_CONFIG = {
  // ─── Couple & Content ───
  couple: {
    name1: "Alex",
    name2: "Manju",
    /** Short display (hero heading) */
    displayNames: "Alex & Manju",
    /** Hero tagline above names */
    tagline: "Wedding Invitation",
    /** Primary wedding message */
    weddingMessage: "Beginning of Our Forever",
    /** Supporting sub-message */
    supportingMessage:
      '"So then, they are no longer two but one flesh. Therefore what God has joined together, let not man separate." — Matthew 19:6',
    /** Venue line shown under date */
    venue: "St. Thomas Orthodox Church · Vadakkannanoor",
    // ─── Family / Invitation ───
    groomParents: "Mr. Kuriakose Chandy & Mrs. Smithamol Sunny",
    groomAddress: "Kannothra Kalambukattu, Kottayam",
    groomHouseShort: "Kannothra Kalambukattu",
    brideParents: "Mr. Mathew John & Mrs. Molly Mathew",
    brideAddress: "Panichiyil House, Kizhumury",
    brideHouseShort: "Panichiyil House",
    invitationIntro:
      "With the grace of God and the blessings of our families, we joyfully invite you to celebrate our wedding",
    sharingHappiness: "Best Compliments by Miss Aleena Kuriakose",
  },

  // ─── Event Dates (ISO with timezone) ───
  dates: {
    engagement: "2026-07-05T11:00:00+05:30", // 5th July 2026, 11:00 AM IST — Engagement ceremony
    wedding: "2026-07-12T11:00:00+05:30", // 12th July 2026, 11:00 AM IST — St. Thomas Orthodox Church, Vadakkannanoor
  },

  // ─── Detailed Event Info ───
  events: {
    betrothal: {
      dateLabel: "Saturday, 5th July 2026",
      time: "11:00 AM",
      venue: "Engagement Ceremony",
      mapsUrl: "",
      receptionVenue: "Reception Venue",
      receptionMapsUrl: "",
    },
    wedding: {
      dateLabel: "Sunday, 12th July 2026",
      time: "11:00 AM",
      venue: "St. Thomas Orthodox Church, Vadakkannanoor, Kerala",
      mapsUrl: "",
      receptionVenue: "Wedding Reception",
      receptionMapsUrl: "",
    },
  },

  // ─── Scripture Banner ───
  scripture: {
    quote:
      '"So then, they are no longer two but one flesh. Therefore what God has joined together, let not man separate."',
    reference: "Matthew 19:6",
  },

  // ─── Our Story Items ───
  story: {
    items: [
      {
        date: "July 5, 2026",
        content: "Engagement ceremony celebrating our commitment.",
      },
      {
        date: "July 12, 2026",
        content:
          "Holy Matrimony at St. Thomas Orthodox Church, Vadakkannanoor, Kerala. Beginning of our forever with God's blessings.",
      },
    ],
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
    /** Hero background image */
    heroBgImage: "/lovable-uploads/Alan/IMG_0575.jpg",
    fireworks: {
      duration: 50000,
      intensity: 7,
      startDelay: 500,
    },
  },

  // ─── Video Intro Screen ───
  videoIntro: {
    /** Top flourish line */
    topFlourish: "You are invited to witness",
    /** "The Wedding of" label */
    weddingOfLabel: "The Wedding of",
    /** CTA text below play button */
    ctaText: "Tap to begin our story",
    /** Venue shown on intro screen (short form) */
    venue: "St. Thomas Orthodox Church · Vadakkannanoor",
  },

  // ─── Preloader ───
  preloader: {
    /** Names shown on preloader screen */
    names: "Alex & Manju",
    /** Scripture quote */
    scriptureQuote: '"What God has joined together, let not man separate"',
    /** Scripture reference */
    scriptureRef: "Matthew 19:6",
  },

  // ─── Gallery ───
  gallery: {
    images: [
      {
        src: "/lovable-uploads/Alan/IMG_0575.jpg",
        alt: "Alex and Manju wedding invitation",
      },
      {
        src: "/lovable-uploads/Alan/IMG_0568.jpg",
        alt: "Alex and Manju together",
      },
      {
        src: "/lovable-uploads/Alan/IMG_0569.jpg",
        alt: "Alex and Manju in traditional attire",
      },
      {
        src: "/lovable-uploads/Alan/IMG_0570.jpg",
        alt: "Alex and Manju celebrating",
      },
      {
        src: "/lovable-uploads/Alan/IMG_0572.jpg",
        alt: "Alex and Manju special moments",
      },
      {
        src: "/lovable-uploads/Alan/IMG_0573.jpg",
        alt: "Alex and Manju together",
      },
      {
        src: "/lovable-uploads/Alan/IMG_0574.jpg",
        alt: "Alex and Manju in an elegant setting",
      },
    ],
  },

  // ─── Hero Corner Frame Images ───
  heroCornerFrames: [
    {
      src: "/lovable-uploads/Alan/IMG_0575.jpg",
      position: "top-[22%] left-14",
      size: "w-28 h-28",
      animation: "animate-wiggle",
    },
    {
      src: "/lovable-uploads/Alan/IMG_0576.jpg",
      position: "top-[22%] right-14",
      size: "w-28 h-28",
      animation: "animate-wiggle-delay",
    },
    {
      src: "/lovable-uploads/Alan/IMG_0568.jpg",
      position: "bottom-[24%] left-14",
      size: "w-24 h-24",
      animation: "animate-wiggle-delay-2",
    },
    {
      src: "/lovable-uploads/Alan/IMG_0569.jpg",
      position: "bottom-[24%] right-14",
      size: "w-24 h-24",
      animation: "animate-wiggle",
    },
  ],

  // ─── Feature Flags ───
  features: {
    autoPlayMusic: false,
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
