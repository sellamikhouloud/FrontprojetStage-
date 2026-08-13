import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],

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
