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
  | "gopuram"
  | "nilavilakku"
  | "marigold-garland"
  | "coconut-fronds"
  | "jasmine-petals"
  | "kasavu-border"
  | "elephant-nettipattam"
  | "lotus"
  | "mural-corner"
  | "peacock-feather"
  | "flute"
  | "temple-bell"
  | "thookku-vilakku"
  | "nirapara"
  | "shankhu"
  | "chirathu"
  | "kolam"
  | "vettila";

/** asset("nilavilakku") → "/img/nilavilakku.svg" (or .png, per ASSET_EXT) */
export const asset = (name: AssetName) => `/img/${name}.${ASSET_EXT}`;

/**
 * Deployed site URL (no trailing slash). Link previews need absolute URLs, so
 * the share image only shows on WhatsApp/Facebook once this is the real domain.
 */
export const SITE_URL = "https://www.example.com"; // TODO: your domain

/** Build an absolute URL from a root-relative path. */
export const absoluteUrl = (path: string) =>
  `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

export const WEDDING_CONFIG = {
  // ─── Couple ───
  // *Name = short name used in the hero/nav; *FullName = shown on the profile cards.
  // Leave a field "" to hide that row (e.g. nakshatram, native place).
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
    brideNakshatram_en: "", // TODO: e.g. "Rohini"
    brideNakshatram_ml: "", // TODO: e.g. "രോഹിണി"
    groomNakshatram_en: "", // TODO
    groomNakshatram_ml: "", // TODO
    brideParents_en: "D/o Sri. Vasudevan Namboothiri & Smt. Sreekala C N",
    brideParents_ml:
      "ശ്രീ. വാസുദേവൻ നമ്പൂതിരിയുടെയും ശ്രീമതി. സി. എൻ. ശ്രീകലയുടെയും മകൾ",
    groomParents_en: "S/o Sri. Somasundaran Koyyodan & Smt. Sudha Bindu",
    groomParents_ml:
      "ശ്രീ. സോമസുന്ദരൻ കൊയ്യോടന്റെയും ശ്രീമതി. സുധ ബിന്ദുവിന്റെയും മകൻ",
    brideTharavad_en: "Thalavannattu Illam",
    brideTharavad_ml: "തലവണ്ണാട്ട് ഇല്ലം",
    groomTharavad_en: "Koyyodan House",
    groomTharavad_ml: "കൊയ്യോടൻ വീട്",
    brideNativePlace_en: "", // TODO: e.g. "Guruvayur, Thrissur"
    brideNativePlace_ml: "", // TODO
    groomNativePlace_en: "", // TODO: e.g. "Kannur"
    groomNativePlace_ml: "", // TODO
    /** Portrait photos (4:5). Replace with real .jpg/.webp files in /public. */
    bridePhoto: "/photos/bride.webp",
    groomPhoto: "/photos/groom.webp",
  },

  // ─── Wedding day ───
  /** Wedding date, ISO yyyy-mm-dd */
  weddingDate: "2026-11-15",
  /** Muhurtham start / end, 24-hour hh:mm in `timezone` */
  muhurthamTime: "10:30",
  muhurthamEndTime: "11:00", // TODO: confirm end of the muhurtham window (only used as the calendar-invite end time)
  /** UTC offset of the times above (India = +05:30) */
  timezone: "+05:30",
  /** Malayalam-calendar (Kollavarsham) date of the wedding */
  malayalamDate_ml: "തുലാം 29, 1202", // TODO: verify against your panchangam / muhurtham letter
  malayalamDate_en: "Thulam 29, 1202 ME",

  // ─── Events timeline (shown top-to-bottom in this order) ───
  // date: ISO yyyy-mm-dd · time/endTime: 24-hour hh:mm (endTime "" = no end shown)
  // timeLabel_en/_ml: optional text shown instead of a clock time (e.g. "Right after the muhurtham")
  // mapUrl: optional "Map" link on the card · highlight: gold-accented card
  // hidden: true keeps an event in the config but off the page until its details are known
  events: [
    {
      name_en: "Nischayam",
      name_ml: "നിശ്ചയം",
      date: "2026-09-01", // TODO
      time: "11:00",
      endTime: "",
      venue: "", // TODO
      mapUrl: "",
      note_en: "The families formally fix the wedding.",
      note_ml: "ഇരു കുടുംബങ്ങളും ചേർന്ന് വിവാഹം ഉറപ്പിക്കുന്ന ചടങ്ങ്.",
      highlight: false,
      hidden: true,
    },
    {
      name_en: "Mehendi & Haldi",
      name_ml: "മൈലാഞ്ചി & ഹൽദി",
      date: "2026-11-13", // TODO
      time: "16:00",
      endTime: "",
      venue: "", // TODO
      mapUrl: "",
      note_en: "An afternoon of henna, turmeric and music with close family.",
      note_ml: "അടുത്ത ബന്ധുക്കളോടൊപ്പം മൈലാഞ്ചിയിടലും മഞ്ഞൾ ചടങ്ങും പാട്ടും.",
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
      venue: "Guruvayoor Temple, East Nada",
      mapUrl: "https://maps.app.goo.gl/RQZej9afcmoRWqnSA",
      note_en: "The auspicious moment. Please be seated by 10:00 AM.",
      note_ml: "ശുഭമുഹൂർത്തം. രാവിലെ 10 മണിക്കു മുൻപായി എത്തിച്ചേരുമല്ലോ.",
      highlight: true,
      hidden: false,
    },
    {
      name_en: "Thali Kettu (Mangalyadharanam)",
      name_ml: "താലികെട്ട് (മാംഗല്യധാരണം)",
      date: "2026-11-15",
      time: "10:30",
      endTime: "",
      venue: "Guruvayoor Temple",
      mapUrl: "",
      note_en: "The groom ties the thali around the bride's neck.",
      note_ml: "വരൻ വധുവിന്റെ കഴുത്തിൽ താലി ചാർത്തുന്നു.",
      highlight: true,
      hidden: true, // part of the muhurtham — explained in the Muhurtham section
    },
    {
      name_en: "Pudava Kodukkal",
      name_ml: "പുടവ കൊടുക്കൽ",
      date: "2026-11-15",
      time: "10:30",
      endTime: "",
      venue: "Guruvayoor Temple",
      mapUrl: "",
      note_en: "The groom presents the bride with the wedding pudava.",
      note_ml: "വരൻ വധുവിന് പുടവ നൽകുന്നു.",
      highlight: false,
      hidden: true, // part of the muhurtham — explained in the Muhurtham section
    },
    {
      name_en: "Kanyadanam",
      name_ml: "കന്യാദാനം",
      date: "2026-11-15",
      time: "10:30",
      endTime: "",
      venue: "Guruvayoor Temple",
      mapUrl: "",
      note_en: "The bride's father places her hand in the groom's.",
      note_ml: "വധുവിന്റെ പിതാവ് മകളുടെ കൈ വരന്റെ കൈകളിൽ ഏൽപ്പിക്കുന്നു.",
      highlight: false,
      hidden: true, // part of the muhurtham — explained in the Muhurtham section
    },
    {
      name_en: "Kalyana Sadya",
      name_ml: "കല്യാണ സദ്യ",
      date: "2026-11-15",
      time: "",
      endTime: "",
      timeLabel_en: "Right after the muhurtham",
      timeLabel_ml: "മുഹൂർത്തം കഴിഞ്ഞ ഉടൻ",
      // Same spot as the muhurtham — the sadya follows right there
      venue: "Guruvayoor Temple, East Nada",
      mapUrl: "https://maps.app.goo.gl/hvDYzCNLv92uqcMu6",
      note_en: "A traditional feast served on the tender banana leaf.",
      note_ml: "തൂശനിലയിൽ വിളമ്പുന്ന തനിനാടൻ സദ്യ.",
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
    {
      name_en: "Griha Pravesham",
      name_ml: "ഗൃഹപ്രവേശം",
      date: "2026-11-15", // TODO
      time: "18:00",
      endTime: "",
      venue: "", // TODO: e.g. "Koyyodan House"
      mapUrl: "",
      note_en: "The bride enters her new home carrying a lit nilavilakku.",
      note_ml:
        "കത്തിച്ച നിലവിളക്കുമായി വധു വരന്റെ വീട്ടിലേക്ക് വലതുകാൽ വെച്ച് കയറുന്നു.",
      highlight: false,
      hidden: true,
    },
  ],

  // ─── Wedding venue (used for the "Add to Calendar" invite) ───
  venue: {
    name_en: "Guruvayoor Temple",
    name_ml: "ഗുരുവായൂർ ക്ഷേത്രം",
    address: "East Nada, Guruvayur, Thrissur, Kerala 680101",
  },

  // ─── Opening video (plays on the first tap, then reveals the site) ───
  intro: {
    /** Portrait video works best — it's cropped to fill the screen */
    video: "/video/opener.mp4",
    /** Second at which the site is revealed (the video is 8s; cut short at 5s, before the doors fully open) */
    revealAtSeconds: 5,
  },

  // ─── Gallery ───
  gallery: [
    { src: "/photos/gallery-1.webp", alt: "Amal and Arya, close embrace" },
    {
      src: "/photos/gallery-2.webp",
      alt: "Amal and Arya walking hand in hand",
    },
    { src: "/photos/gallery-3.webp", alt: "Amal and Arya laughing together" },
    {
      src: "/photos/gallery-4.webp",
      alt: "Amal and Arya hugging in the meadow",
    },
    { src: "/photos/gallery-5.webp", alt: "Amal and Arya, candid moments" },
    { src: "/photos/gallery-6.webp", alt: "Amal and Arya among the trees" },
    {
      src: "/photos/gallery-7.webp",
      alt: "Amal and Arya, black and white moments",
    },
    {
      src: "/photos/gallery-8.webp",
      alt: "Amal and Arya dancing in the hills",
    },
    { src: "/photos/gallery-9.webp", alt: "Arya by the lake at golden hour" },
  ],

  // ─── Live stream ───
  /** Link the "Watch live" button opens. Leave "" to show a "link coming soon" note. */
  liveStreamUrl: "https://www.youtube.com/@your-channel/live", // TODO
  /** Optional embeddable player (e.g. https://www.youtube.com/embed/VIDEO_ID). "" = button only. */
  liveStreamEmbedUrl: "",

  // ─── RSVP (name + message, delivered by EmailJS — https://www.emailjs.com) ───
  // Template variables sent: from_name, message, couple_names, wedding_date,
  // to_email, reply_to (same names as the previous site's template).
  email: {
    /** Where RSVPs go — one address or several. Used as {{to_email}} in the template. */
    recipientEmails: ["abrin1999@gmail.com"], // TODO: e.g. ["amal@example.com", "arya@example.com"]
    emailJS: {
      serviceId: "service_qjht1ax",
      templateId: "template_3xnyrgi",
      publicKey: "06oig93wOq67ST0Sc",
    },
  },

  // ─── Footer / contact ───
  hashtag: "#AmalWedsArya", // TODO: your hashtag
  contactPhone: "+91 98765 43210", // TODO: family contact number

  // ─── Background music ───
  // Starts the instant the opening video is tapped (same gesture, so the
  // browser allows sound), then keeps playing under the site — the nav's
  // music button (MusicPlayerV2) can pause/resume it from there.
  audioUrl: "/audio/ullam-paadum.mp3",

  // ─── Sharing / SEO (baked into index.html at build time by vite.config.ts) ───
  seo: {
    title: "Amal & Arya · Wedding · 15 November 2026",
    description:
      "Join us for the wedding of Amal & Arya at Guruvayoor Temple on Sunday, 15 November 2026. Muhurtham at 10:30 AM. Reception on 16 November at Dhanalakshmi Convention Centre, Kannur.",
    /** 1200×630 share card shown by WhatsApp/Facebook/iMessage/X link previews */
    ogImage: "/img/og-image.jpg",
  },
};

export type WeddingEvent = (typeof WEDDING_CONFIG.events)[number];

/** Muhurtham start/end as full ISO timestamps — the countdown + .ics targets. */
export const MUHURTHAM_START = `${WEDDING_CONFIG.weddingDate}T${WEDDING_CONFIG.muhurthamTime}:00${WEDDING_CONFIG.timezone}`;
export const MUHURTHAM_END = `${WEDDING_CONFIG.weddingDate}T${WEDDING_CONFIG.muhurthamEndTime}:00${WEDDING_CONFIG.timezone}`;
