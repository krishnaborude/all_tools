import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // Relative assets so the app works on GitHub Pages project URLs like /all_tools/
  base: "./",
  plugins: [react()],
});
