import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { WEDDING_CONFIG, SITE_URL } from "./src/config/dates";

const weddingTitle = WEDDING_CONFIG.couple.displayNames;
const weddingDescription = WEDDING_CONFIG.couple.displayNames;
const weddingOgImage = WEDDING_CONFIG.media.ogImage;
const weddingSiteUrl = SITE_URL;

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
        return html
          .replace(/%WEDDING_TITLE%/g, weddingTitle)
          .replace(/%WEDDING_DESCRIPTION%/g, weddingDescription)
          .replace(/%WEDDING_OG_IMAGE%/g, weddingOgImage)
          .replace(/%WEDDING_SITE_URL%/g, weddingSiteUrl);
      },
    },
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
