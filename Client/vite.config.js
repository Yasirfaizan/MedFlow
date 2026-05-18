import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Tailwind v3 should run via PostCSS (not @tailwindcss/vite)
export default defineConfig({
  plugins: [react()],
});
