/**
 * Ancy & Ashish — Betrothal invitation.
 * Every word and image on the page comes from this file.
 *
 * Content marked `TODO` / lorem ipsum is a placeholder the family will
 * supply later — everything else is copied from the printed invitation.
 */

/** Deployed site URL — used for absolute OG/share URLs. TODO: set the real domain. */
export const SITE_URL = "https://ancyashish.vercel.app";

const LOREM_SHORT =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
const LOREM_LONG =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus, posuere velit aliquet. Donec ullamcorper nulla non metus auctor fringilla, vestibulum id ligula porta felis euismod semper.";

export const SITE = {
  couple: {
    bride: "Ancy",
    groom: "Ashish",
    /** Shown in the monogram / favicon */
    monogram: ["A", "A"] as const,
  },

  // ─── Families (verbatim from the invitation) ───
  brideFamily: {
    parents: "Mrs. Reena Francis & Mr. Francis C.A",
    house: "Chiriyankandath House",
    address: "Kayyala Road, Olarikkara, Pullazhi P.O, Thrissur - 680012",
  },
  groomFamily: {
    relation: "S/o",
    parents: "Mrs. Reena Johnson & Mr. Johnson P. G (Late)",
    house: "Punnassery House",
    address: "Yordhanapuram P.O, Angamaly - Kalady, Ernakulam",
  },

  invitation: {
    hosts: "Mrs. Reena Francis & Mr. Francis C.A.",
    body:
      "Cordially invite your gracious presence and blessings with family on the auspicious occasion of the Betrothal Ceremony of our daughter",
    blessedLine: "Which will be blessed on",
  },

  // ─── Events ───
  betrothal: {
    title: "Betrothal Ceremony",
    iso: "2027-01-02T11:00:00+05:30",
    /** Used for calendar files — a sensible window, not printed anywhere */
    endIso: "2027-01-02T14:00:00+05:30",
    dateLabel: "Saturday, 02 January 2027",
    time: "11:00 AM",
    venue: "Little Flower Church, Olarikkara",
    lunch: "Little Flower Church Parish Hall",
    mapsQuery: "Little Flower Church, Olarikkara, Thrissur",
    /** TODO: paste the exact Google Maps share link if the family has one */
    mapsUrl: "",
  },
  wedding: {
    title: "Holy Matrimony",
    iso: "2027-01-10T12:05:00+05:30",
    endIso: "2027-01-10T14:00:00+05:30",
    dateLabel: "Sunday, 10 January 2027",
    time: "12:05 PM",
    venue: "St. John the Baptist Church, Yordhanapuram",
    mapsQuery: "St. John the Baptist Church, Yordhanapuram, Kalady",
    mapsUrl: "",
  },

  // ─── Placeholder content (to be supplied) ───
  scripture: [
    {
      quote: "“And now these three remain: faith, hope and love. But the greatest of these is love.”",
      reference: "1 Corinthians 13:13",
    },
  ],
  story: [
    { label: "Lorem ipsum", title: "Where it began", text: LOREM_SHORT, photo: "couple-2" },
    { label: "Dolor sit amet", title: "The question", text: LOREM_LONG, photo: "couple-3" },
    { label: "02 · 01 · 2027", title: "Forever, blessed", text: LOREM_SHORT, photo: "couple-1" },
  ],
  footerNote: LOREM_SHORT,

  // ─── Photos (/public/ancy-ashish) ───
  photos: [
    { id: "couple-1", alt: "Ancy and Ashish among blush roses" },
    { id: "couple-2", alt: "Ancy and Ashish sitting together" },
    { id: "couple-3", alt: "Ancy and Ashish in the garden" },
  ],
  heroPhoto: "couple-1",

  // ─── Media ───
  /** TODO: the couple's own song. Empty string hides the music button. */
  musicUrl: "/music/msuic1.mp3",

  // ─── Wishes (EmailJS) ───
  wishes: {
    /** TODO: who receives the wishes. Empty → the form shows "opening soon" instead of sending. */
    recipientEmails: ["ancyfranciz@gmail.com"] as string[],
  },

  // ─── SEO / sharing ───
  seo: {
    title: "Ancy & Ashish · Betrothal · 02 January 2027",
    description:
      "Ancy & Ashish — Betrothal Ceremony on Saturday, 02 January 2027 at 11:00 AM, Little Flower Church, Olarikkara, Thrissur. With the blessings of our families, you are warmly invited.",
    ogImage: "/ancy-ashish/og.jpg",
    ogImageWidth: 1200,
    ogImageHeight: 630,
    themeColor: "#f7f3ea",
    locale: "en_IN",
  },
};

export const photoSrc = (id: string, size: "full" | "sm" = "full") => ({
  webp: `/ancy-ashish/${id}${size === "sm" ? "-sm" : ""}.webp`,
  jpg: `/ancy-ashish/${id}.jpg`,
});

export const mapsLink = (ev: { mapsUrl: string; mapsQuery: string }) =>
  ev.mapsUrl ||
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ev.mapsQuery)}`;

/** Google Calendar "add event" link — needs no backend or .ics file. */
export const calendarLink = (ev: {
  title: string;
  iso: string;
  endIso: string;
  venue: string;
}) => {
  const fmt = (iso: string) =>
    new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const p = new URLSearchParams({
    action: "TEMPLATE",
    text: `${ev.title} · ${SITE.couple.bride} & ${SITE.couple.groom}`,
    dates: `${fmt(ev.iso)}/${fmt(ev.endIso)}`,
    location: ev.venue,
    details: `${SITE_URL}`,
  });
  return `https://calendar.google.com/calendar/render?${p.toString()}`;
};
