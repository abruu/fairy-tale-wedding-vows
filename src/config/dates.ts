// Wedding event configuration — ALL content is driven from this config

/** Deployed site URL — used for absolute URLs in OG tags, share links, etc. */
export const SITE_URL = "https://www.abrinelsa.in";

/** Build an absolute URL from a root-relative path (e.g. "/abrinelsa/1.jpg" → "https://www.abrinelsa.in/abrinelsa/1.jpg") */
export const absoluteUrl = (path: string) =>
  `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

// ─── Canonical couple data ───
const groomName = "Abrin"; // TODO: fill in full name
const brideName = "Elsa"; // TODO: fill in full name
/** Set to true to show bride's side first (bride-side website), false for groom first */
const brideFirst = true;

const firstPerson = brideFirst ? brideName : groomName;
const secondPerson = brideFirst ? groomName : brideName;
const firstShort = brideFirst
  ? brideName.split(" ")[0]
  : groomName.split(" ")[0];
const secondShort = brideFirst
  ? groomName.split(" ")[0]
  : brideName.split(" ")[0];

export const WEDDING_CONFIG = {
  // ─── Couple & Content ───
  couple: {
    /** Canonical names (always groom then bride regardless of display order) */
    groomName,
    brideName,
    /** Flag: true = bride's side shown first */
    brideFirst,
    /** Display names (computed from brideFirst flag) */
    name1: firstPerson,
    name2: secondPerson,
    /** Short display (hero heading) */
    displayNames: `${firstShort} & ${secondShort}`,
    /** Hero tagline above names */
    tagline: "Wedding Invitation",
    /** Primary wedding message */
    weddingMessage: "We are getting married",
    /** Supporting sub-message */
    supportingMessage:
      '"So then, they are no longer two but one flesh. Therefore what God has joined together, let not man separate." — Matthew 19:6',
    /** Venue line shown under date */
    venue: "TODO: venue name · city", // TODO: fill in real wedding venue
    // ─── Family / Invitation ───
    groomParents: "TODO: groom's parents", // TODO: fill in
    groomAddress: "TODO: groom's house address", // TODO: fill in
    groomHouseShort: "TODO: House Name",
    brideParents: "TODO: bride's parents", // TODO: fill in
    brideAddress: "TODO: bride's house address", // TODO: fill in
    brideHouseShort: "TODO: House Name",
    invitationIntro:
      "With the grace of God and the blessings of our families, we joyfully invite you to celebrate our wedding",
    sharingHappiness: "",
    brideSharingHappiness: "",
  },

  // ─── Event Dates (ISO with timezone) ───--
  dates: {
    engagement: "2027-01-02T00:00:00+05:30", // TODO: set real engagement/betrothal date & time
    wedding: "2027-01-02T00:00:00+05:30", // 2nd Jan 2027 — matches comingSoonConfig.weddingDate; update venue/time below
  },

  // ─── Detailed Event Info ───
  events: {
    betrothal: {
      dateLabel: "TODO: e.g. Saturday, 2nd January 2027", // TODO: fill in
      time: "TODO: e.g. 11:30 AM",
      venue: "TODO: betrothal venue",
      mapsUrl: "",
      receptionVenue: "",
      receptionMapsUrl: "",
    },
    wedding: {
      dateLabel: "TODO: e.g. Saturday, 2nd January 2027", // TODO: fill in
      time: "TODO: e.g. 11:30 AM",
      venue: "TODO: wedding venue",
      mapsUrl: "",
      receptionVenue: "TODO: reception venue",
      receptionMapsUrl: "",
    },
  },

  // ─── Post-Wedding Mode ───
  // Once `activeFrom` passes, the site stops showing the envelope intro
  // entirely and opens straight onto a looping celebration video with a
  // thank-you message in place of the usual hero.
  postWedding: {
    /** ISO with offset — the moment the site flips into post-wedding mode. */
    activeFrom: "2027-01-03T00:00:00+05:30",
    /** Plays muted on loop, full-viewport. */
    video: "/video/post-wedding.mp4",
    eyebrow: "With all our love",
    heading: "We're Married",
    message:
      "Thank you to every single person who stood with us, prayed for us and celebrated this day alongside us. We carry your love with us into this new life together.",
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
        date: "TODO: date", // TODO: fill in real story milestones
        content: "TODO: engagement ceremony details.",
      },
      {
        date: "January 2, 2027",
        content: "TODO: wedding ceremony and reception details.",
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
    /** Shown in place of a live counter once the betrothal date has passed */
    pastEngagementLabel: "Engaged",
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
    youtubeUrl: "", // TODO: fill in real video URL if used
    musicUrl: "/music/msuic1.mp3",
    /** Hero background image */
    heroBgImage: "/abrinelsa/abrinelsa.jpg", // TODO: replace with a real hero photo once gallery assets are ready
    /** OG / share image (absolute URL for social crawlers) */
    ogImage: absoluteUrl("/og-abrin-elsa.jpg"),
    /** Intro sequence video (desktop) */
    introVideoDesktop: "/video/opening_envlop.mp4",
    /**
     * TODO: currently reusing the desktop cut (8.5 MB). Replace with a real
     * shorter/lower-res vertical export for mobile viewports once available.
     */
    introVideoMobile: "/video/opening_envlop.mp4",
    /**
     * Seconds into the intro at which the curtain reveal fires — set to the
     * beat where the envelope finishes opening. The reveal does not wait for
     * the video to end.
     */
    introRevealAtSeconds: 4,
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
    venue: "TODO: venue name · city", // TODO: fill in
  },

  // ─── Preloader ───
  preloader: {
    /** Names shown on preloader screen */
    names: `${firstShort} & ${secondShort}`,
    /** Scripture quote */
    scriptureQuote: '"What God has joined together, let not man separate"',
    /** Scripture reference */
    scriptureRef: "Matthew 19:6",
  },

  // ─── Gallery ───
  // TODO: only one couple photo exists under /public/abrinelsa today (abrinelsa.jpg).
  // Add real gallery photos to /public/abrinelsa and list them here.
  gallery: {
    images: [
      {
        src: "/abrinelsa/abrinelsa.jpg",
        alt: "Abrin and Elsa",
      },
    ],
  },

  // ─── Hero Corner Frame Images ───
  // TODO: replace with real gallery photos once available (currently reusing the one couple photo)
  heroCornerFrames: [
    {
      src: "/abrinelsa/abrinelsa.jpg",
      position: "top-[22%] left-14",
      size: "w-28 h-28",
      animation: "animate-wiggle",
    },
    {
      src: "/abrinelsa/abrinelsa.jpg",
      position: "top-[22%] right-14",
      size: "w-28 h-28",
      animation: "animate-wiggle-delay",
    },
    {
      src: "/abrinelsa/abrinelsa.jpg",
      position: "bottom-[24%] left-14",
      size: "w-24 h-24",
      animation: "animate-wiggle-delay-2",
    },
    {
      src: "/abrinelsa/abrinelsa.jpg",
      position: "bottom-[24%] right-14",
      size: "w-24 h-24",
      animation: "animate-wiggle",
    },
  ],

  // ─── Email Configuration ───
  email: {
    /** Email addresses to receive wedding wishes (can be single email or array of emails) */
    recipientEmails: [""], // TODO: fill in recipient email for RSVP/wishes
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

/**
 * True once the wedding is behind us. Drives the whole post-wedding switch:
 * the intro is skipped and the hero becomes the looping thank-you video.
 * Evaluated per call rather than cached, so a long-lived tab flips over too.
 */
export const isPostWedding = () =>
  Date.now() >= new Date(WEDDING_CONFIG.postWedding.activeFrom).getTime();
