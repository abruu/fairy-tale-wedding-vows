import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { comingSoonConfig } from "./src/coming-soon/config";

const { seo, groom, bride, displayDate, copy } = comingSoonConfig;

const siteUrl = seo.siteUrl.replace(/\/$/, "");
const absolute = (p: string) =>
  !p || /^https?:\/\//.test(p) ? p : `${siteUrl}${p.startsWith("/") ? p : `/${p}`}`;

const names = `${groom} & ${bride}`;
const ogImage = absolute(seo.ogImage);

/** Schema.org Event — only facts we actually have (no invented venue/address). */
const jsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Event",
  name: `Wedding of ${names}`,
  startDate: seo.isoDate,
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  description: seo.description,
  url: siteUrl,
  ...(ogImage ? { image: [ogImage] } : {}),
});

const tokens: Record<string, string> = {
  "%WEDDING_TITLE%": seo.title,
  "%WEDDING_DESCRIPTION%": seo.description,
  "%WEDDING_NAMES%": names,
  "%WEDDING_DISPLAY_DATE%": displayDate,
  "%WEDDING_TAGLINE%": copy.tagline,
  "%WEDDING_SITE_URL%": siteUrl,
  // href attributes use the underscore form: Vite parses URL attributes and
  // chokes on "%WE…" as an invalid percent-escape.
  __WEDDING_SITE_URL__: siteUrl,
  "%WEDDING_OG_IMAGE%": ogImage,
  "%WEDDING_OG_W%": String(seo.ogImageWidth),
  "%WEDDING_OG_H%": String(seo.ogImageHeight),
  "%WEDDING_THEME_COLOR%": seo.themeColor,
  "%WEDDING_LOCALE%": seo.locale,
  "%WEDDING_TWITTER_CARD%": seo.twitterCard,
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
