import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  base: '/frontend/',
  server: {
    host: "::",
    port: 8080,
  },
  // Removed undefined `componentTagger` plugin that was breaking dev server
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
