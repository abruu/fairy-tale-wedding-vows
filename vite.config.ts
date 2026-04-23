import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { WEDDING_CONFIG } from "./src/config/dates";

const weddingTitle = WEDDING_CONFIG.couple.displayNames;
const weddingDescription = WEDDING_CONFIG.couple.displayNames;

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
    {
      name: 'wedding-html-inject',
      transformIndexHtml(html: string) {
        return html
          .replace(/%WEDDING_TITLE%/g, weddingTitle)
          .replace(/%WEDDING_DESCRIPTION%/g, weddingDescription);
      },
    },
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
