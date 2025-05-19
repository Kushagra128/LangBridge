import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Vite config for React + API proxy
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Proxy /api requests to backend server
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        ws: true,
        secure: false,
      },
    },
  },
});
