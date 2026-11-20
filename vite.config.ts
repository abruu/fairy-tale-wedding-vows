import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import fs from "fs";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { comingSoonConfig } from "./src/coming-soon/config";
import { BRIDE_INVITE_PATH } from "./src/config/dates";
import {
  buildIcs,
  getCalendarEvent,
  type CalendarEventKey,
} from "./src/lib/calendar";

const CALENDAR_KEYS: CalendarEventKey[] = ["betrothal", "wedding"];

const { seo, groom, bride, displayDate, copy } = comingSoonConfig;

const siteUrl = seo.siteUrl.replace(/\/$/, "");
const absolute = (p: string) =>
  !p || /^https?:\/\//.test(p) ? p : `${siteUrl}${p.startsWith("/") ? p : `/${p}`}`;

const names = `${groom} & ${bride}`;
const ogImage = absolute(seo.ogImage);

/** Schema.org Event — only facts we actually have. */
const jsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Event",
  name: `Wedding of ${names}`,
  startDate: seo.isoDate,
  location: {
    "@type": "Place",
    name: seo.venueName,
    address: {
      "@type": "PostalAddress",
      addressLocality: seo.venueLocality,
      addressCountry: "IN",
    },
  },
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

// "Add to calendar" files (/calendar/betrothal.ics, /calendar/wedding.ics)
// generated from src/config/dates.ts — real files, because iOS Safari only
// offers "Add to Calendar" reliably for served .ics files.
const calendarFiles: Plugin = {
  name: "wedding-calendar-files",
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      const match = req.url?.match(
        /^\/calendar\/(betrothal|wedding)\.ics(?:\?|$)/,
      );
      if (!match) return next();
      res.setHeader("Content-Type", "text/calendar; charset=utf-8");
      res.end(buildIcs(getCalendarEvent(match[1] as CalendarEventKey)));
    });
  },
  generateBundle() {
    for (const key of CALENDAR_KEYS) {
      this.emitFile({
        type: "asset",
        fileName: `calendar/${key}.ics`,
        source: buildIcs(getCalendarEvent(key)),
      });
    }
  },
};

/**
 * Set the value attribute of the one <meta>/<link> whose `keyAttr` equals
 * `key`. Throws when the tag is missing so a template change can't silently
 * ship the groom's preview on the bride's link.
 */
const setTagValue = (
  html: string,
  keyAttr: "name" | "property" | "rel",
  key: string,
  value: string,
  valueAttr: "content" | "href" = "content",
) => {
  const re = new RegExp(
    `(<(?:meta|link)\\s[^>]*\\b${keyAttr}="${key.replace(/[.:]/g, "\\$&")}"[^>]*?\\b${valueAttr}=")[^"]*(")`,
  );
  if (!re.test(html)) throw new Error(`bride invite: no ${keyAttr}="${key}" tag in index.html`);
  return html.replace(re, (_, open: string, close: string) => open + value + close);
};

// The bride's family shares `/b`. Link-preview crawlers (WhatsApp, Facebook…)
// don't run JS and see one HTML file per path, so `/b` gets its own copy of
// the built index.html with the betrothal title, description and share image.
// The app itself is identical — it reads the path to pick the bride side.
const brideInvitePage: Plugin = {
  name: "wedding-bride-invite-page",
  apply: "build",
  writeBundle(options) {
    const outDir = options.dir ?? "dist";
    const bride = seo.bride;
    const url = `${siteUrl}${BRIDE_INVITE_PATH}`;
    const image = absolute(bride.ogImage);
    let html = fs.readFileSync(path.join(outDir, "index.html"), "utf8");
    html = html.replace(/<title>[^<]*<\/title>/, `<title>${bride.title}</title>`);
    html = setTagValue(html, "name", "description", bride.description);
    html = setTagValue(html, "rel", "canonical", url, "href");
    html = setTagValue(html, "property", "og:title", bride.title);
    html = setTagValue(html, "property", "og:description", bride.description);
    html = setTagValue(html, "property", "og:url", url);
    html = setTagValue(html, "name", "twitter:title", bride.title);
    html = setTagValue(html, "name", "twitter:description", bride.description);
    if (ogImage) {
      html = setTagValue(html, "property", "og:image", image);
      html = setTagValue(html, "property", "og:image:alt", bride.imageAlt);
      html = setTagValue(html, "name", "twitter:image", image);
    }
    const dir = path.join(outDir, BRIDE_INVITE_PATH.replace(/^\//, ""));
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "index.html"), html);
  },
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
    calendarFiles,
    brideInvitePage,
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
