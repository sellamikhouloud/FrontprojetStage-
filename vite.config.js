import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "NutriGest",
        short_name: "NutriGest",
        theme_color: "#4E9F8A", 
        icons: [
          { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,PNG}"],
      },
    }),
  ],

  assetsInclude: ["**/*.PNG"],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  // server: {
  //   host: "192.168.100.12",
  //   port: 5173,
  // },
});