// Wedding configuration — ALL couple details for the site live in this
// one file. Every field ending in `_en` / `_ml` is shown when that language is
// active (English / Malayalam). UI labels live in src/v2/lib/translations.ts.

// ─── Decorative art ───
/**
 * File extension of every decorative layer in /public/img. The placeholders
 * are SVG; once the real transparent PNGs are dropped into /public/img with
 * the same base names, change this one value to "png".
 */
export const ASSET_EXT: "svg" | "png" = "svg";

export type AssetName =
  | "eucalyptus-branch-left"
  | "eucalyptus-branch-right"
  | "olive-branch"
  | "peony-cluster"
  | "botanical-sprig"
  | "herb-sprig"
  | "gold-dust"
  | "soft-petals"
  | "gold-line-arch"
  | "gold-rings-glow";

/** asset("olive-branch") → "/img/olive-branch.svg" (or .png, per ASSET_EXT) */
export const asset = (name: AssetName) => `/img/${name}.${ASSET_EXT}`;

/**
 * Deployed site URL (no trailing slash). Link previews need absolute URLs, so
 * the share image only shows on WhatsApp/Facebook once this is the real domain.
 */
export const SITE_URL = "https://amalarya.vercel.app";

/** Build an absolute URL from a root-relative path. */
export const absoluteUrl = (path: string) =>
  `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

export const WEDDING_CONFIG = {
  // ─── Couple ───
  // *Name = short name used in the hero/nav; *FullName = shown on the profile cards.
  // Leave a field "" to hide that row (e.g. hometown).
  couple: {
    /** true = bride shown first everywhere (bride-side website), false = groom first */
    brideFirst: false,
    brideName_en: "Arya",
    brideName_ml: "ആര്യ",
    brideFullName_en: "Arya Vasudevan",
    brideFullName_ml: "ആര്യ വാസുദേവൻ",
    groomName_en: "Amal",
    groomName_ml: "അമൽ",
    groomFullName_en: "Amal Somasundaran",
    groomFullName_ml: "അമൽ സോമസുന്ദരൻ",
    brideParents_en: "D/o Sri. Vasudevan Namboothiri & Smt. Sreekala C N",
    brideParents_ml:
      "ശ്രീ. വാസുദേവൻ നമ്പൂതിരിയുടെയും ശ്രീമതി. സി. എൻ. ശ്രീകലയുടെയും മകൾ",
    groomParents_en: "S/o Sri. Somasundaran Koyyodan & Smt. Sudha Bindu",
    groomParents_ml:
      "ശ്രീ. സോമസുന്ദരൻ കൊയ്യോടന്റെയും ശ്രീമതി. സുധ ബിന്ദുവിന്റെയും മകൻ",
    brideHometown_en: "", // TODO: e.g. "Thrissur"
    brideHometown_ml: "", // TODO
    groomHometown_en: "", // TODO: e.g. "Kannur"
    groomHometown_ml: "", // TODO
    /** Portrait photos (4:5). Replace with real .jpg/.webp files in /public. */
    bridePhoto: "/photos/bride.webp",
    groomPhoto: "/photos/groom.webp",
  },

  // ─── Wedding day ───
  /** Wedding date, ISO yyyy-mm-dd */
  weddingDate: "2026-11-15",
  /** Muhurtham (ceremony) start / end, 24-hour hh:mm in `timezone` */
  muhurthamTime: "10:30",
  muhurthamEndTime: "11:00", // TODO: confirm end of the muhurtham window (only used as the calendar-invite end time)
  /** UTC offset of the times above (India = +05:30) */
  timezone: "+05:30",
  /**
   * Once every celebration is behind this moment, the hero swaps its
   * countdown for a "We're Married!" status instead. Set to match the
   * Reception's date + endTime in events[] below.
   */
  celebrationsEndDate: "2026-11-16",
  celebrationsEndTime: "21:00",

  // ─── Events timeline (shown top-to-bottom in this order) ───
  // date: ISO yyyy-mm-dd · time/endTime: 24-hour hh:mm (endTime "" = no end shown)
  // timeLabel_en/_ml: optional text shown instead of a clock time (e.g. "Right after the muhurtham")
  // mapUrl: optional "Map" link on the card · highlight: emphasised card
  // hidden: true keeps an event in the config but off the page until its details are known
  events: [
    {
      name_en: "Engagement",
      name_ml: "വിവാഹനിശ്ചയം",
      date: "2026-09-01", // TODO
      time: "11:00",
      endTime: "",
      venue: "", // TODO
      mapUrl: "",
      note_en: "The families celebrate the engagement.",
      note_ml: "ഇരു കുടുംബങ്ങളും ചേർന്ന് വിവാഹനിശ്ചയം ആഘോഷിക്കുന്നു.",
      highlight: false,
      hidden: true,
    },
    {
      name_en: "Mehendi",
      name_ml: "മെഹന്ദി",
      date: "2026-11-13", // TODO
      time: "16:00",
      endTime: "",
      venue: "", // TODO
      mapUrl: "",
      note_en: "An afternoon of henna and music with close family.",
      note_ml:
        "അടുത്ത ബന്ധുക്കളോടൊപ്പം മൈലാഞ്ചിയും പാട്ടുമായി ഒരു ഉച്ചതിരിഞ്ഞ്.",
      highlight: false,
      hidden: true,
    },
    {
      name_en: "Sangeet",
      name_ml: "സംഗീത്",
      date: "2026-11-14", // TODO
      time: "19:00",
      endTime: "",
      venue: "", // TODO
      mapUrl: "",
      note_en: "Songs, dance and dinner.",
      note_ml: "പാട്ടും നൃത്തവും അത്താഴവുമായി ഒരു രാവ്.",
      highlight: false,
      hidden: true,
    },
    {
      name_en: "Muhurtham",
      name_ml: "മുഹൂർത്തം",
      date: "2026-11-15",
      time: "10:30",
      endTime: "",
      venue: "Guruvayoor, Thrissur", // TODO: full venue name
      mapUrl: "https://maps.app.goo.gl/RQZej9afcmoRWqnSA",
      note_en: "The wedding ceremony. Please be seated by 10:00 AM.",
      note_ml:
        "വിവാഹ ചടങ്ങ്. രാവിലെ 10 മണിക്കു മുൻപായി ഇരിപ്പിടങ്ങളിൽ എത്തിച്ചേരണം.",
      highlight: true,
      hidden: false,
    },
    {
      name_en: "Wedding Ceremony",
      name_ml: "വിവാഹ ചടങ്ങ്",
      date: "2026-11-15",
      time: "10:30",
      endTime: "",
      venue: "Guruvayoor, Thrissur", // TODO: full venue name
      mapUrl: "",
      note_en: "The exchange of vows and garlands.",
      note_ml: "വധൂവരന്മാർ വിവാഹപ്രതിജ്ഞയും മാല കൈമാറ്റവും നടത്തുന്നു.",
      highlight: false,
      hidden: true, // same moment as the Muhurtham — the Muhurtham section covers it
    },
    {
      name_en: "Wedding Feast / Sadya",
      name_ml: "വിവാഹ സദ്യ",
      date: "2026-11-15",
      time: "",
      endTime: "",
      timeLabel_en: "Right after the muhurtham",
      timeLabel_ml: "മുഹൂർത്തം കഴിഞ്ഞ ഉടൻ",
      venue: "Parvathy Kalyana Mandapam",
      mapUrl: "https://maps.app.goo.gl/hvDYzCNLv92uqcMu6",
      note_en: "A traditional Kerala feast, served right after the ceremony.",
      note_ml: "ചടങ്ങിനു ശേഷം വിളമ്പുന്ന തനി കേരളീയ സദ്യ.",
      highlight: false,
      hidden: false,
    },
    {
      name_en: "Reception",
      name_ml: "വിവാഹ സൽക്കാരം",
      date: "2026-11-16",
      time: "17:00",
      endTime: "21:00",
      venue:
        "Dhanalakshmi Convention Centre (Sadhoo Kalyana Mandapam), Thana, Kannur",
      mapUrl: "https://maps.app.goo.gl/JdMvnBcZuvkvHNux9",
      note_en: "An evening with family and friends, music and dinner.",
      note_ml: "ബന്ധുമിത്രാദികളോടൊപ്പം സംഗീതവും അത്താഴവുമായി ഒരു സായാഹ്നം.",
      highlight: false,
      hidden: false,
    },
  ],

  // ─── Wedding venue (used for the "Add to Calendar" invite) ───
  venue: {
    name_en: "Guruvayoor, Thrissur", // TODO: full venue name
    address: "Guruvayoor, Thrissur, Kerala 680101", // TODO: full street address
  },

  // ─── Opening screen ───
  intro: {
    /** Portrait photo shown in the arch window on the opening screen (portrait works best) */
    photo: "/photos/intro.webp",
  },

  // ─── Gallery (width/height = the image's real pixel size, so the masonry grid doesn't shift while loading) ───
  gallery: [
    {
      src: "/photos/gallery-1.webp",
      w: 960,
      h: 1200,
      alt: "Amal and Arya, close embrace",
    },
    {
      src: "/photos/gallery-2.webp",
      w: 960,
      h: 1200,
      alt: "Amal and Arya walking hand in hand",
    },
    {
      src: "/photos/gallery-3.webp",
      w: 800,
      h: 1200,
      alt: "Amal and Arya laughing together",
    },
    {
      src: "/photos/gallery-4.webp",
      w: 588,
      h: 1200,
      alt: "Amal and Arya hugging in the meadow",
    },
    {
      src: "/photos/gallery-5.webp",
      w: 960,
      h: 1200,
      alt: "Amal and Arya, candid moments",
    },
    {
      src: "/photos/gallery-6.webp",
      w: 1080,
      h: 810,
      alt: "Amal and Arya among the trees",
    },
    {
      src: "/photos/gallery-7.webp",
      w: 840,
      h: 1049,
      alt: "Amal and Arya, black and white moments",
    },
    {
      src: "/photos/gallery-8.webp",
      w: 700,
      h: 1052,
      alt: "Amal and Arya dancing in the hills",
    },
    {
      src: "/photos/gallery-9.webp",
      w: 834,
      h: 556,
      alt: "Arya by the lake at golden hour",
    },
  ],

  // ─── Wishes form (name + message, delivered by EmailJS — https://www.emailjs.com) ───
  // Template variables sent: from_name, message, couple_names, wedding_date,
  // to_email, reply_to (same names as the previous site's template).
  email: {
    /** Where RSVPs go — one address or several. Used as {{to_email}} in the template. */
    recipientEmails: ["aryavasudevan2000@gmail.com,amalkoyyodan21@gmail.com"], // TODO: e.g. ["amal@example.com", "arya@example.com"]
    emailJS: {
      serviceId: "service_qjht1ax",
      templateId: "template_3xnyrgi",
      publicKey: "06oig93wOq67ST0Sc",
    },
  },

  // ─── Footer ───
  hashtag: "#AmalWedsArya", // TODO: your hashtag

  // ─── Background music ───
  // Starts the instant "Tap to open" is pressed (browsers only allow sound
  // that begins inside a tap), then keeps playing under the site — the music
  // button (MusicPlayerV2) can pause/resume it from there.
  audioUrl: "/audio/ullam.mp3",

  // ─── Sharing / SEO (baked into index.html at build time by vite.config.ts) ───
  seo: {
    title: "Amal & Arya · Wedding · 15 November 2026",
    description:
      "Join us for the wedding of Amal & Arya on Sunday, 15 November 2026. Muhurtham at 10:30 AM. Reception on 16 November at Dhanalakshmi Convention Centre, Kannur.",
    /** 1200×630 share card shown by WhatsApp/Facebook/iMessage/X link previews */
    ogImage: "/img/og-image.jpg",
  },
};

export type WeddingEvent = (typeof WEDDING_CONFIG.events)[number];

/** Muhurtham start/end as full ISO timestamps — the countdown + .ics targets. */
export const MUHURTHAM_START = `${WEDDING_CONFIG.weddingDate}T${WEDDING_CONFIG.muhurthamTime}:00${WEDDING_CONFIG.timezone}`;
export const MUHURTHAM_END = `${WEDDING_CONFIG.weddingDate}T${WEDDING_CONFIG.muhurthamEndTime}:00${WEDDING_CONFIG.timezone}`;

/** The moment every celebration (through the reception) is behind us. */
export const CELEBRATIONS_END = `${WEDDING_CONFIG.celebrationsEndDate}T${WEDDING_CONFIG.celebrationsEndTime}:00${WEDDING_CONFIG.timezone}`;

/**
 * True once the whole wedding is behind us — flips the hero from the
 * muhurtham countdown to a "We're Married!" status. Evaluated per call
 * rather than cached, so a tab left open across that moment flips over too.
 */
export const isWeddingOver = () =>
  Date.now() >= new Date(CELEBRATIONS_END).getTime();
