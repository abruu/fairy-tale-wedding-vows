// Wedding event configuration — ALL content is driven from this config
export const WEDDING_CONFIG = {
  // ─── Couple & Content ───
  couple: {
    name1: "Nikhil",
    name2: "Sona",
    /** Short display (hero heading) */
    displayNames: "Nikhil & Sona",
    /** Hero tagline above names */
    tagline: "Wedding Invitation",
    /** Primary wedding message */
    weddingMessage: "We are getting married",
    /** Supporting sub-message */
    supportingMessage:
      '"I have found the one whom my soul loves" — Song of Solomon 3:4',
    /** Venue line shown under date */
    venue: "St. Antony's Church · Arimbur",
    // ─── Family / Invitation ───
    groomParents: "Mrs. Sheeba Antony & (Late) Antony C. K.",
    groomAddress: "Chiriyankandath House, Manakody, Thrissur",
    groomHouseShort: "Chiriyankandath House",
    brideParents: "Mrs. Sherly Wilson & Mr. Wilson C A",
    brideAddress: "Chalakkal House, Thriprayar, Thrissur",
    brideHouseShort: "Chalakkal House",
    invitationIntro:
      "Cordially invite your esteemed presence with family on the auspicious occasion of the wedding of their son,",
    sharingHappiness:
      "Sharing the happiness: Averin, Adhaline & Amyra Ember Wilson",
  },

  // ─── Event Dates (ISO with timezone) ───
  dates: {
    engagement: "2026-05-06T11:00:00+05:30", // 6th May 2026, 11:00 AM IST — St. Jude Church, Thriprayar
    wedding: "2026-05-12T15:30:00+05:30", // 12th May 2026, 3:30 PM IST — St. Antony's Church, Arimbur
  },

  // ─── Detailed Event Info ───
  events: {
    betrothal: {
      dateLabel: "Wednesday, 6th May 2026",
      time: "11:00 AM",
      venue: "St. Jude Church, Thriprayar",
      mapsUrl: "",
      receptionVenue: "Zahras International Convention Centre, Chenthrapini",
      receptionMapsUrl: "",
    },
    wedding: {
      dateLabel: "Tuesday, 12th May 2026",
      time: "3:30 PM",
      venue: "St. Antony's Church, Arimbur",
      mapsUrl: "",
      receptionVenue: "Parish Hall, St. Antony's Church, Arimbur",
      receptionMapsUrl: "",
    },
  },

  // ─── Scripture Banner ───
  scripture: {
    quote: '"Let all that you do be done in love."',
    reference: "1 Corinthians 16:14",
  },

  // ─── Our Story Items ───
  story: {
    items: [
      {
        date: "May 6, 2026",
        content: "Betrothal at St. Jude Church, Thriprayar.",
      },
      {
        date: "May 12, 2026",
        content:
          "Holy Matrimony at St. Antony's Church, Arimbur. A new forever begins.",
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
    heroBgImage: "/lovable-uploads/image.jpeg",
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
    venue: "St. Antony's Church · Arimbur",
  },

  // ─── Preloader ───
  preloader: {
    /** Names shown on preloader screen */
    names: "Nikhil & Sona",
    /** Scripture quote */
    scriptureQuote: '"God has made everything beautiful in its time"',
    /** Scripture reference */
    scriptureRef: "Ecclesiastes 3:11",
  },

  // ─── Gallery ───
  gallery: {
    images: [
      {
        src: "/lovable-uploads/image.jpeg",
        alt: "Family photo at the engagement ceremony",
      },
      {
        src: "/lovable-uploads/image.jpeg",
        alt: "Nikhil and Sona in traditional attire",
      },
      {
        src: "/lovable-uploads/image.jpeg",
        alt: "Nikhil and Sona together",
      },
      {
        src: "/lovable-uploads/image.jpeg",
        alt: "Nikhil and Sona together",
      },
      { src: "/lovable-uploads/image.jpeg", alt: "Nikhil and Sona posing" },
      {
        src: "/lovable-uploads/image.jpeg",
        alt: "Nikhil and Sona outdoors",
      },
      {
        src: "/lovable-uploads/image.jpeg",
        alt: "Nikhil and Sona in an elegant setting",
      },
    ],
  },

  // ─── Hero Corner Frame Images ───
  heroCornerFrames: [
    {
      src: "/lovable-uploads/image.jpeg",
      position: "top-[22%] left-14",
      size: "w-28 h-28",
      animation: "animate-wiggle",
    },
    {
      src: "/lovable-uploads/image.jpeg",
      position: "top-[22%] right-14",
      size: "w-28 h-28",
      animation: "animate-wiggle-delay",
    },
    {
      src: "/lovable-uploads/image.jpeg",
      position: "bottom-[24%] left-14",
      size: "w-24 h-24",
      animation: "animate-wiggle-delay-2",
    },
    {
      src: "/lovable-uploads/image.jpeg",
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
