import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    proxy: {
      "/api": {
        target: "https://adrienn-backend.onrender.com/",
        changeOrigin: true,
        secure: true, // Set this to false if you face SSL issues during local development
      },
    },
  },
});
