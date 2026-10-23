import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { buildIcs } from "./src/v2/lib/calendar";
import { componentTagger } from "lovable-tagger";
import { ENGAGEMENT_END, ENGAGEMENT_START, SITE_URL, WEDDING_CONFIG, absoluteUrl } from "./src/config/dates";
import { formatDate, formatTime } from "./src/v2/lib/format";

// Everything below is injected into index.html at build time, so link
// previews (WhatsApp, Facebook, X…) show the couple without running any JS.
const { couple, seo, engagement } = WEDDING_CONFIG;
const { venue } = engagement;
const [first, second] = couple.brideFirst
  ? [couple.brideName_en, couple.groomName_en]
  : [couple.groomName_en, couple.brideName_en];

const siteUrl = SITE_URL.replace(/\/$/, "");
const names = `${first} & ${second}`;
const ogImage = seo.ogImage ? absoluteUrl(seo.ogImage) : "";
const displayDate = formatDate(engagement.date, "en", false);
const fullDate = formatDate(engagement.date, "en");
const title = `${names} · Engagement · ${displayDate}`;
const description = `Join us for the engagement of ${names} on ${fullDate} at ${formatTime(engagement.time, "en")}, ${venue.name_en}, Bengaluru.`;

/** Schema.org Event — only facts that are in the config. */
const jsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Event",
  name: `Engagement of ${names}`,
  startDate: ENGAGEMENT_START,
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  location: { "@type": "Place", name: venue.name_en, address: venue.address_en },
  description,
  url: siteUrl,
  ...(ogImage ? { image: [ogImage] } : {}),
});

const tokens: Record<string, string> = {
  "%WEDDING_TITLE%": title,
  "%WEDDING_DESCRIPTION%": description,
  "%WEDDING_NAMES%": names,
  "%WEDDING_DISPLAY_DATE%": displayDate,
  "%WEDDING_SITE_URL%": siteUrl,
  // href attributes use the underscore form: Vite parses URL attributes and
  // chokes on "%WE…" as an invalid percent-escape.
  __WEDDING_SITE_URL__: siteUrl,
  "%WEDDING_OG_IMAGE%": ogImage,
  "%WEDDING_OG_W%": "1200",
  "%WEDDING_OG_H%": "630",
  "%WEDDING_THEME_COLOR%": "#6B1F2E",
  "%WEDDING_LOCALE%": "en_IN",
  "%WEDDING_TWITTER_CARD%": "summary_large_image",
  "%WEDDING_JSON_LD%": jsonLd,
};

/** The engagement invite as a real file at /engagement.ics — iOS Safari only opens its
 *  "Add to Calendar" sheet for a served URL, not for a blob: download. */
const engagementIcs = buildIcs({
  start: ENGAGEMENT_START,
  end: ENGAGEMENT_END,
  title: `Engagement · ${names}`,
  description: `Engagement of ${names}`,
  location: `${venue.name_en}, ${venue.address_en}`,
  uid: `engagement-${engagement.date}@invitation`,
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    {
      name: "engagement-ics",
      configureServer(server) {
        server.middlewares.use("/engagement.ics", (_req, res) => {
          res.setHeader("Content-Type", "text/calendar; charset=utf-8");
          res.end(engagementIcs);
        });
      },
      generateBundle() {
        this.emitFile({ type: "asset", fileName: "engagement.ics", source: engagementIcs });
      },
    },
    {
      name: "wedding-html-inject",
      transformIndexHtml(html: string) {
        // Drop every image-related meta tag when no share image is configured,
        // rather than emitting tags that point at nothing.
        if (!ogImage) {
          html = html.replace(
            /^[ \t]*<meta[^>]*(?:og:image|twitter:image)[^>]*>\n?/gm,
            "",
          );
        }
        return Object.entries(tokens).reduce(
          (out, [token, value]) => out.split(token).join(value),
          html,
        );
      },
    },
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
