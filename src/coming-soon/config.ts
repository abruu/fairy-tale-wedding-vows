/**
 * Coming Soon — central configuration.
 * Everything shown on the one-screen landing page is driven from here.
 */

export interface QuizQuestion {
  /** Question text shown to the visitor */
  question: string;
  /** Answer options (usually the two names) */
  options: string[];
  /** Index of the "correct" answer inside `options` */
  correct: number;
}

export const comingSoonConfig = {
  // ─── Couple ───
  groom: "Abrin",
  bride: "Elsa",
  /** ISO date/time of the wedding — countdown target */
  weddingDate: "2027-01-02T00:00:00+05:30",
  /** Elegant date display */
  displayDate: "02 · 01 · 2027",
  /** Small label above the date */
  dateLabel: "Save the Date",

  // ─── Copy ───
  copy: {
    tagline: "Two hearts. One story. Forever begins soon.",
    comingSoon: "Something beautiful is coming.",
    supporting:
      "Our little corner of the internet is getting ready for our big day.",
    musicHint: "Every love story has a song. This one is ours.",
    gameCta: "How Well Do You Know Us?",
    /** Whispered after the heart is tapped, then fades away */
    loveBurst: "And so their forever begins…",
    /** Opening gate — this is a coming-soon page, not an invitation */
    enterTitle: "Two hearts · One story",
    enterCta: "Tap to Begin",
    enterNote: "Best experienced with sound",
  },

  // ─── Countdown labels ───
  countdown: {
    days: "Days",
    hours: "Hrs",
    minutes: "Min",
    seconds: "Sec",
    /** Shown once the wedding day arrives */
    finished: "Today is the day.",
  },

  // ─── Couple photo used behind the composition ───
  photo: {
    /** Modern format first, JPEG fallback for older browsers */
    webp: "/abrinelsa/abrinelsa.webp",
    webpSmall: "/abrinelsa/abrinelsa-sm.webp",
    jpg: "/abrinelsa/abrinelsa.jpg",
    alt: "Abrin and Elsa",
    /** How present the photo is behind the ivory scene (0–1) */
    opacityDesktop: 0.5,
    opacityMobile: 0.42,
  },

  // ─── Music ───
  music: {
    /** Swap in the real wedding song here */
    src: "/music/msuic1.mp3",
    label: "Our Song",
    /** Attempt playback on load (browsers usually block sound until a gesture) */
    tryAutoplay: true,
    /**
     * When autoplay with sound is refused, start the song muted and unmute it
     * on the visitor's very first tap/click/keypress anywhere on the page.
     */
    startOnFirstInteraction: true,
    /**
     * Show the one-tap opening gate. Browsers never allow audible autoplay
     * without a gesture, so this is the only way the song reliably plays for
     * everyone: the tap that opens the invitation also starts the music.
     * Set to false to fall back to autoplay + first-interaction unmuting.
     */
    entryGate: true,
    volume: 0.45,
  },

  // ─── Mini game ───
  quiz: {
    title: "How Well Do You Know Abrin & Elsa? ",
    questions: [
      {
        question: 'Who said "I love you" first?',
        options: ["Abrin", "Elsa"],
        correct: 0,
      },
      {
        question: "Who takes longer to get ready?",
        options: ["Abrin", "Elsa"],
        correct: 1,
      },
      {
        question: "Who is more likely to be late?",
        options: ["Abrin", "Elsa"],
        correct: 0,
      },
      {
        question: "Who is the better cook?",
        options: ["Abrin", "Elsa"],
        correct: 1,
      },
      {
        question: "Who is more romantic?",
        options: ["Abrin", "Elsa"],
        correct: 0,
      },
    ] as QuizQuestion[],
    results: {
      /** Shown when the visitor gets at least `goodScore` right */
      goodScore: 4,
      good: "You clearly know this couple! 💕",
      okay: "Not bad — you know us a little.",
      poor: "Looks like you need a little more Abrin & Elsa research before January 2nd! 😄",
      playAgain: "Play Again",
      close: "Close",
    },
  },

  // ─── Page metadata (injected into index.html at build time) ───
  seo: {
    title: "Abrin & Elsa | Betrothal & Wedding Invitation",
    /** One preview serves both family links (`/` and `/?=b`), so it names both events. */
    description:
      "Abrin & Elsa invite you to their betrothal on 28 December 2026 at St. Mary's Church, Elamgulam, and their wedding on 2 January 2027 at St. Antony's Church, Arimpur.",
    /**
     * Root-relative share card in /public (see scripts/og-image.html for the
     * source). Set to "" to omit the og:image / twitter:image tags entirely.
     */
    ogImage: "/og-abrin-elsa.jpg",
    ogImageWidth: 1200,
    ogImageHeight: 630,
    /**
     * Preview for the bride's-family link (`/b`): the build writes a copy of
     * index.html to dist/b/index.html with these swapped in, so WhatsApp etc.
     * show the betrothal card there. Source: scripts/og-image-betrothal.html.
     * Same 1200x630 size as ogImage.
     */
    bride: {
      title: "Elsa & Abrin | Betrothal & Wedding Invitation",
      description:
        "Elsa & Abrin invite you to their betrothal on 28 December 2026 at St. Mary's Church, Elamgulam, and their wedding on 2 January 2027 at St. Antony's Church, Arimpur.",
      ogImage: "/og-elsa-abrin-betrothal.jpg",
      imageAlt: "Elsa & Abrin — Betrothal, 28 December 2026",
    },
    /** Deployed origin — used for canonical + absolute OG URLs */
    siteUrl: "https://www.abrinelsa.in",
    themeColor: "#f7efe3",
    locale: "en_IN",
    twitterCard: "summary_large_image",
    /** Machine-readable wedding date for structured data */
    isoDate: "2027-01-02T11:00:00+05:30",
    /** Wedding venue for structured data */
    venueName: "St. Antony's Church",
    venueLocality: "Arimpur, Thrissur, Kerala",
  },

  // ─── Decorative behaviour ───
  decor: {
    /** Floating petals on desktop / mobile (mobile is deliberately lighter) */
    petalsDesktop: 14,
    petalsMobile: 6,
    /** Cursor-reactive background drift on pointer devices */
    cursorParallax: true,
  },
} as const;

export type ComingSoonConfig = typeof comingSoonConfig;
