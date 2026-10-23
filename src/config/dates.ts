// Engagement configuration — ALL couple details for the site live in this
// one file. Every field ending in `_en` / `_hi` is shown when that language is
// active (English / Hindi). UI labels live in src/v2/lib/translations.ts.

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
export const SITE_URL = "https://amalarya.vercel.app"; // TODO: swap for this site's own domain

/** Build an absolute URL from a root-relative path. */
export const absoluteUrl = (path: string) =>
  `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

export const WEDDING_CONFIG = {
  // ─── Couple ───
  // *Name = short name used in the hero/nav; *FullName = shown on the profile cards.
  couple: {
    /** true = bride shown first everywhere, false = groom first */
    brideFirst: true,
    brideName_en: "Monika",
    brideName_hi: "मोनिका",
    brideFullName_en: "Monika",
    brideFullName_hi: "मोनिका",
    groomName_en: "Dhirender",
    groomName_hi: "धीरेन्द्र",
    groomFullName_en: "Dhirender",
    groomFullName_hi: "धीरेन्द्र",
    brideParents_en: "D/o Smt. Renuka Devi & Sh. Late Jithender Kumar",
    brideParents_hi: "श्रीमती रेणुका देवी एवं स्व. श्री जितेन्द्र कुमार की सुपुत्री",
    groomParents_en: "S/o Smt. Saroj Devi & Sh. Harender Singh",
    groomParents_hi: "श्रीमती सरोज देवी एवं श्री हरेन्द्र सिंह के सुपुत्र",
  },

  // ─── Engagement ───
  // This site is for the engagement only — there is no wedding-day section.
  engagement: {
    /** Engagement date, ISO yyyy-mm-dd */
    date: "2026-11-20",
    /** Start / end, 24-hour hh:mm in `timezone`. `endTime` only sets the calendar invite's end. */
    time: "11:00", // TODO: confirm the start time (placeholder)
    endTime: "14:00", // TODO: confirm
    /** UTC offset of the times above (India = +05:30) */
    timezone: "+05:30",
    venue: {
      name_en: "Arekas Arena",
      name_hi: "अरेकास एरेना",
      address_en:
        "Survey No. 119, Arekere Village, Hesaraghatta Hobli, Yelahanka Taluk, Bengaluru, Karnataka 562163",
      address_hi:
        "सर्वे नं. 119, अरेकेरे गाँव, हेसरघट्टा होबली, येलहंका तालुक, बेंगलुरु, कर्नाटक 562163",
      mapUrl: "https://maps.app.goo.gl/xS7UbUyaqBtjctWR8",
      /** Apple Maps pin (coordinates from the Google Maps link) */
      appleMapUrl: "https://maps.apple.com/?ll=13.2029937,77.5426564&q=Arekas%20Arena",
    },
  },

  // ─── Wishes form (name + message, delivered by EmailJS — https://www.emailjs.com) ───
  // Template variables sent: from_name, message, couple_names, wedding_date,
  // to_email, reply_to. The form stays closed ("not open yet") until
  // recipientEmails has at least one address.
  email: {
    /** Where wishes go — one address or several. Used as {{to_email}} in the template. */
    recipientEmails: ["Dhirender3434@gmail.com"] as string[],
    // NOTE: still the previous couple's EmailJS account — replace with your own before enabling.
    emailJS: {
      serviceId: "service_qjht1ax",
      templateId: "template_3xnyrgi",
      publicKey: "06oig93wOq67ST0Sc",
    },
  },

  // ─── Footer ───
  hashtag: "", // TODO: optional, e.g. "#MonikaWedsDhirender" — hidden while empty

  // ─── Background music ───
  // Starts the instant "Tap to open" is pressed (browsers only allow sound
  // that begins inside a tap). Leave "" for no music — the music button is
  // hidden. TODO: placeholder — the previous couple's song; swap in this couple's mp3.
  audioUrl: "/audio/ullam.mp3",

  // ─── Sharing / SEO (baked into index.html at build time by vite.config.ts) ───
  // Title + description are generated from the names, date and venue above.
  seo: {
    /** 1200×630 share card shown by WhatsApp/Facebook/iMessage/X link previews */
    ogImage: "/img/og-image.jpg",
  },
};

/** Engagement start/end as full ISO timestamps — the countdown + .ics targets. */
const { engagement } = WEDDING_CONFIG;
export const ENGAGEMENT_START = `${engagement.date}T${engagement.time}:00${engagement.timezone}`;
export const ENGAGEMENT_END = `${engagement.date}T${engagement.endTime}:00${engagement.timezone}`;

/**
 * True once the engagement is behind us — flips the hero from the countdown to
 * a "We're Engaged!" status. Evaluated per call rather than cached, so a tab
 * left open across that moment flips over too.
 */
export const isEngagementOver = () => Date.now() >= new Date(ENGAGEMENT_END).getTime();
