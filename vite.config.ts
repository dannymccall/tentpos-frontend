import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    visualizer({
      open: false,       // set true only when analyzing
      gzipSize: true,
      brotliSize: true,
    }),
  ],

  /**
   * IMPORTANT:
   * This MUST match how Nginx serves TentPOS
   * Example: http://domain/tentpos/
   */
  base: "/tentpos/",

  /**
   * Dev server
   */
  server: {
    port: 5175,
    open: "/tentpos",
  },

  /**
   * Path aliases
   */
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  /**
   * Silence known ESM warnings
   */
  esbuild: {
    logOverride: {
      "this-is-undefined-in-esm": "silent",
    },
  },

  /**
   * Optimized production build
   */
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks: {
          // React core
          vendors: [
            "react",
            "react-dom",
            "react-router-dom",
          ],

          // State & data
          query: ["@tanstack/react-query"],

          // UI & animation
          motion: ["framer-motion"],
          radix: [
            "@radix-ui/react-accordion",
            "@radix-ui/react-avatar",
            "@radix-ui/react-checkbox",
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-label",
            "@radix-ui/react-popover",
            "@radix-ui/react-scroll-area",
            "@radix-ui/react-select",
            "@radix-ui/react-separator",
            "@radix-ui/react-slot",
            "@radix-ui/react-switch",
            "@radix-ui/react-tabs",
          ],

          // Forms & validation
          forms: [
            "react-hook-form",
            "@hookform/resolvers",
            "zod",
          ],

          // Charts & data
          charts: ["recharts"],
          csv: ["papaparse", "xlsx"],

          // PDF
          pdf: ["jspdf", "jspdf-autotable"],

          // Icons & utils
          icons: ["lucide-react", "react-icons"],
          utils: ["clsx", "class-variance-authority", "tailwind-merge", "date-fns"],
        },
      },
    },
  },
});
