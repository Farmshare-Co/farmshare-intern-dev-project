import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  // Use GitHub Pages base path only for GitHub Pages, not Vercel
  base:
    mode === "production" && !process.env.VERCEL
      ? "/farmshare-intern-dev-project/"
      : "/",
  server: {
    host: true, // or use "0.0.0.0"
    port: 5173,
  },
}));
