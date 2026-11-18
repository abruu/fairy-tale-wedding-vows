// Wedding event configuration — ALL content is driven from this config

/** Deployed site URL — used for absolute URLs in OG tags, share links, etc. */
export const SITE_URL = "https://www.abrinelsa.in";

/** Build an absolute URL from a root-relative path (e.g. "/abrinelsa/1.jpg" → "https://www.abrinelsa.in/abrinelsa/1.jpg") */
export const absoluteUrl = (path: string) =>
  `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

// ─── Invite side (one site, two invitations) ───
// The groom's family shares the plain URL; the bride's family shares `?=b`.
//   groom (default): Abrin first, the WEDDING is the headline event.
//   bride  (`?=b`) : Elsa first, the BETROTHAL is the headline event.
// `?b`, `?side=b` and `?v=b` are accepted too, so a hand-typed link still works.
export type InviteSide = "groom" | "bride";

export const detectInviteSide = (
  search: string = typeof window !== "undefined" ? window.location.search : "",
): InviteSide => {
  for (const [key, value] of new URLSearchParams(search)) {
    if (key.toLowerCase() === "b" || value.toLowerCase() === "b") return "bride";
  }
  return "groom";
};

/** Read once at load — the invite side never changes during a visit. */
const inviteSide: InviteSide = detectInviteSide();

// ─── Canonical couple data ───
const groomName = "Abrin C Saiju";
const brideName = "Elsa P Francis";
/** Bride's side is shown first on the bride's-family invite (`?=b`). */
const brideFirst = inviteSide === "bride";
/** Event the invite leads with: `dates`/`events` keys and its display name. */
const featured = brideFirst
  ? ({ dateKey: "engagement", eventKey: "betrothal", label: "Betrothal" } as const)
  : ({ dateKey: "wedding", eventKey: "wedding", label: "Wedding" } as const);

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
  invite: {
    side: inviteSide,
    /** The headline event for this invite — highlighted across the site. */
    featured,
  },

  couple: {
    /** Canonical names (always groom then bride regardless of display order) */
    groomName,
    brideName,
    /** true on the bride's-family invite (`?=b`) — set from the URL, see top of file */
    brideFirst,
    /** Display names (computed from brideFirst flag) */
    name1: firstPerson,
    name2: secondPerson,
    /** First names in display order — hero, intro, anywhere space is tight */
    shortName1: firstShort,
    shortName2: secondShort,
    /** Short display (hero heading) */
    displayNames: `${firstShort} & ${secondShort}`,
    /** Hero tagline above names */
    tagline: `${featured.label} Invitation`,
    /** Primary wedding message */
    weddingMessage: "We are getting married",
    /** Supporting sub-message */
    supportingMessage:
      '"So then, they are no longer two but one flesh. Therefore what God has joined together, let not man separate." — Matthew 19:6',
    // ─── Family / Invitation ───
    groomParents: "Saiju Thomas & Ajitha K Paul",
    groomAddress: "Challissery (H), Manakody P.O., Thrissur",
    groomHouseShort: "Challissery",
    brideParents: "Babu Antony & Tessy P Zacharia",
    brideAddress: "Pidiencheril (H), Anickadu P.O., Pallickathodu",
    brideHouseShort: "Pidiencheril",
    invitationIntro:
      `With the grace of God and the blessings of our families, we joyfully invite you to celebrate our ${featured.label.toLowerCase()}`,
    sharingHappiness: "",
    brideSharingHappiness: "",
  },

  // ─── Event Dates (ISO with timezone) ───--
  dates: {
    engagement: "2026-12-28T11:00:00+05:30", // Betrothal — Mon 28 Dec 2026, 11 AM
    wedding: "2027-01-02T11:00:00+05:30", // Wedding — Sat 2 Jan 2027, 11 AM
  },

  // ─── Detailed Event Info ───
  events: {
    betrothal: {
      dateLabel: "Monday, 28th December 2026",
      time: "11:00 AM",
      venue: "St. Mary's Church, Elamgulam",
      /** Short "venue · city" line for the intro and hero */
      venueShort: "St. Mary's Church · Elamgulam",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=St.+Mary%27s+Church%2C+Elamgulam",
      /** Heading for the meal/reception row on the event card */
      receptionLabel: "Lunch",
      receptionVenue:
        "Orchard River Mansion Homestay & Convention Centre, Pulickakandathil (H), Near Murikkumpuzha Devi Temple, Parappaly Road, Pala, Kerala 686575",
      receptionMapsUrl: "https://www.google.com/maps/search/?api=1&query=Orchard+River+Mansion+Homestay+%26+Convention+Centre%2C+Pala",
    },
    wedding: {
      dateLabel: "Saturday, 2nd January 2027",
      time: "11:00 AM",
      venue: "St. Antony's Church, Arimpur",
      /** Short "venue · city" line for the intro and hero */
      venueShort: "St. Antony's Church · Arimpur",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=St.+Antony%27s+Church%2C+Arimpur%2C+Thrissur",
      /** Heading for the meal/reception row on the event card */
      receptionLabel: "Lunch",
      receptionVenue: "St. Antony's Community (Parish) Hall, Arimpur",
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
  // Sticky-scroll "Our Journey" chapters. Copy is deliberately generic —
  // TODO: replace titles/content with the couple's own words.
  //  - `event`: shows that date from `dates` beside the label.
  //  - `image`: optional per-chapter photo (defaults to media.heroBgImage).
  //  - `focus`: where the framed "camera" settles — x/y is the point of the
  //    photo (in %) to centre in the frame, scale is the zoom. With a single
  //    shared photo this turns the chapters into a slow tour across it.
  story: {
    items: [
      {
        label: "The Beginning",
        title: "Two paths, one plan",
        content:
          "Long before we knew it, our steps were already being guided toward each other — two lives, gently woven into one story by grace.",
        focus: { x: 66, y: 43, scale: 2 }, // her
      },
      {
        label: "The Blessing",
        title: "Two families, one heart",
        content:
          "With the prayers and blessings of our parents and loved ones, a quiet hope grew into a promise we were ready to make.",
        focus: { x: 41, y: 28, scale: 2 }, // him
      },
      {
        label: "The Betrothal",
        event: "engagement",
        title: "A promise before God",
        content:
          "Surrounded by family, we exchange our first vows — a sacred beginning, held in faith and sealed in love.",
        focus: { x: 54, y: 36, scale: 1.4 }, // both
      },
      {
        label: "The Wedding",
        event: "wedding",
        title: "And so, forever begins",
        content:
          "Two become one. We would be honoured to have you with us on the day our journey truly begins.",
        focus: { x: 50, y: 45, scale: 1.02 }, // full photo
      },
    ] as {
      label: string;
      title: string;
      content: string;
      event?: "engagement" | "wedding";
      image?: string;
      focus?: { x: number; y: number; scale: number };
    }[],
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
    /** Hero background image — webp: same photo as abrinelsa.jpg at ~40% the size */
    heroBgImage: "/abrinelsa/abrinelsa.webp", // TODO: replace with a real hero photo once gallery assets are ready
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
    introRevealAtSeconds: 4.5,
    fireworks: {
      duration: 50000,
      intensity: 7,
      startDelay: 500,
    },
  },

  // ─── Video Intro Screen ───
  videoIntro: {
    /** Top flourish line */
    topFlourish: `You are invited to the ${featured.label.toLowerCase()} of`,
    /** "The Wedding of" label */
    weddingOfLabel: "The Wedding of",
    /** CTA text below play button */
    ctaText: "Open the invitation",
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
