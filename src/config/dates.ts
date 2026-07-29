// Wedding event configuration — ALL content is driven from this config

/** Deployed site URL — used for absolute URLs in OG tags, share links, etc. */
export const SITE_URL = "https://sebinpraveena.vercel.app";

/** Build an absolute URL from a root-relative path (e.g. "/Sebin/1.jpg" → "https://sebinpraveena.vercel.app/Sebin/1.jpg") */
export const absoluteUrl = (path: string) =>
  `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

export const WEDDING_CONFIG = {
  // ─── Couple & Content ───
  couple: {
    name1: "Sebin John",
    name2: "Praveena Paul",
    /** Short display (hero heading) */
    displayNames: "Sebin & Praveena",
    /** Hero tagline above names */
    tagline: "Wedding Invitation",
    /** Primary wedding message */
    weddingMessage: "We are getting married",
    /** Supporting sub-message */
    supportingMessage:
      '"So then, they are no longer two but one flesh. Therefore what God has joined together, let not man separate." — Matthew 19:6',
    /** Venue line shown under date */
    venue: "Pampady Dayara Church · Kottayam",
    // ─── Family / Invitation ───
    groomParents: "Mr. P A John & Mrs. Gracy John",
    groomAddress: "Pulickal House, Aruvikuzhy P O, Kottayam, Kerala Pin 686503",
    groomHouseShort: "Pulickal House",
    brideParents: "Mr. Paul P P & Mrs. Rosily Joy",
    brideAddress: "Penattu House",
    brideHouseShort: "Penattu House",
    invitationIntro:
      "With the grace of God and the blessings of our families, we joyfully invite you to celebrate our wedding",
    sharingHappiness: "Best Compliments by Fr. Thomas, Saniya & Abel",
  },

  // ─── Event Dates (ISO with timezone) ───
  dates: {
    engagement: "2026-08-17T12:00:00+05:30", // 17th Aug 2026, 12:00 PM IST — Engagement ceremony
    wedding: "2026-08-23T11:30:00+05:30", // 23rd August 2026, 11:30 AM IST — Pampady Dayara Church, Kottayam
  },

  // ─── Detailed Event Info ───
  events: {
    betrothal: {
      dateLabel: "Monday, 17th August 2026",
      time: "12:00 PM",
      venue: "Mulanthuruthy Church Community Hall",
      mapsUrl: "https://maps.app.goo.gl/caLcK3zZt9DuEbjFA?g_st=aw",
      receptionVenue: "",
      receptionMapsUrl: "",
    },
    wedding: {
      dateLabel: "Sunday, 23rd August 2026",
      time: "11:30 AM",
      venue: "Pampady Dayara Church",
      mapsUrl: "https://maps.app.goo.gl/qTyvU2wbLQBZxWp89?g_st=ic",
      receptionVenue: "P. C. Yohannan Ramban Memorial Dhyana Mandiram",
      receptionMapsUrl: "https://maps.app.goo.gl/5kyJgix7T5RRev9RA?g_st=ic",
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
        date: "August 17, 2026",
        content: "Engagement ceremony at Mulanthuruthy Church Community Hall.",
      },
      {
        date: "August 23, 2026",
        content:
          "Holy Matrimony at Pampady Dayara Church, followed by reception at P. C. Yohannan Ramban Memorial Dhyana Mandiram.",
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
    heroBgImage: "/Sebin/1.jpg",
    /** OG / share image (absolute URL for social crawlers) */
    ogImage: absoluteUrl("/Sebin/11.jpg"),
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
    venue: "Pampady Dayara Church · Kottayam",
  },

  // ─── Preloader ───
  preloader: {
    /** Names shown on preloader screen */
    names: "Sebin & Praveena",
    /** Scripture quote */
    scriptureQuote: '"What God has joined together, let not man separate"',
    /** Scripture reference */
    scriptureRef: "Matthew 19:6",
  },

  // ─── Gallery ───
  gallery: {
    images: [
      {
        src: "/Sebin/1.jpg",
        alt: "Sebin and Praveena wedding invitation",
      },
      {
        src: "/Sebin/2.jpg",
        alt: "Sebin and Praveena together",
      },
      {
        src: "/Sebin/3.jpg",
        alt: "Sebin and Praveena in traditional attire",
      },
      {
        src: "/Sebin/4.jpg",
        alt: "Sebin and Praveena celebrating",
      },
      {
        src: "/Sebin/5.jpg",
        alt: "Sebin and Praveena special moments",
      },
      {
        src: "/Sebin/6.jpg",
        alt: "Sebin and Praveena together",
      },
      {
        src: "/Sebin/7.jpg",
        alt: "Sebin and Praveena in an elegant setting",
      },
      {
        src: "/Sebin/8.jpg",
        alt: "Sebin and Praveena in an elegant setting",
      },
      {
        src: "/Sebin/9.jpg",
        alt: "Sebin and Praveena cherished moment",
      },

      {
        src: "/Sebin/11.jpg",
        alt: "Sebin and Praveena lovely moment",
      },
      {
        src: "/Sebin/10.jpg",
        alt: "Sebin and Praveena special memory",
      },
    ],
  },

  // ─── Hero Corner Frame Images ───
  heroCornerFrames: [
    {
      src: "/Sebin/2.jpg",
      position: "top-[22%] left-14",
      size: "w-28 h-28",
      animation: "animate-wiggle",
    },
    {
      src: "/Sebin/3.jpg",
      position: "top-[22%] right-14",
      size: "w-28 h-28",
      animation: "animate-wiggle-delay",
    },
    {
      src: "/Sebin/4.jpg",
      position: "bottom-[24%] left-14",
      size: "w-24 h-24",
      animation: "animate-wiggle-delay-2",
    },
    {
      src: "/Sebin/5.jpg",
      position: "bottom-[24%] right-14",
      size: "w-24 h-24",
      animation: "animate-wiggle",
    },
  ],

  // ─── Email Configuration ───
  email: {
    /** Email addresses to receive wedding wishes (can be single email or array of emails) */
    recipientEmails: ["sebinjohn1997@gmail.com"],
    /** EmailJS configuration (free service) */
    emailJS: {
      serviceId: "service_qjht1ax", // Replace with your EmailJS service ID
      templateId: "template_3xnyrgi", // Replace with your EmailJS template ID
      publicKey: "06oig93wOq67ST0Sc", // Replace with your EmailJS public key
    },
  },

  // ─── Feature Flags ───
  //test1
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
