import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { MUHURTHAM_START, SITE_URL, WEDDING_CONFIG, absoluteUrl } from "./src/config/dates";

// Everything below is injected into index.html at build time, so link
// previews (WhatsApp, Facebook, X…) show the couple without running any JS.
const { couple, seo, venue, weddingDate } = WEDDING_CONFIG;
const [first, second] = couple.brideFirst
  ? [couple.brideName_en, couple.groomName_en]
  : [couple.groomName_en, couple.brideName_en];

const siteUrl = SITE_URL.replace(/\/$/, "");
const names = `${first} & ${second}`;
const ogImage = seo.ogImage ? absoluteUrl(seo.ogImage) : "";
const displayDate = new Date(`${weddingDate}T12:00:00Z`).toLocaleDateString("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/** Schema.org Event — only facts that are in the config. */
const jsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Event",
  name: `Wedding of ${names}`,
  startDate: MUHURTHAM_START,
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  location: { "@type": "Place", name: venue.name_en, address: venue.address },
  description: seo.description,
  url: siteUrl,
  ...(ogImage ? { image: [ogImage] } : {}),
});

const tokens: Record<string, string> = {
  "%WEDDING_TITLE%": seo.title,
  "%WEDDING_DESCRIPTION%": seo.description,
  "%WEDDING_NAMES%": names,
  "%WEDDING_DISPLAY_DATE%": displayDate,
  "%WEDDING_SITE_URL%": siteUrl,
  // href attributes use the underscore form: Vite parses URL attributes and
  // chokes on "%WE…" as an invalid percent-escape.
  __WEDDING_SITE_URL__: siteUrl,
  "%WEDDING_OG_IMAGE%": ogImage,
  "%WEDDING_OG_W%": "1200",
  "%WEDDING_OG_H%": "630",
  "%WEDDING_THEME_COLOR%": "#7B1E2B",
  "%WEDDING_LOCALE%": "en_IN",
  "%WEDDING_TWITTER_CARD%": "summary_large_image",
  "%WEDDING_JSON_LD%": jsonLd,
};

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
