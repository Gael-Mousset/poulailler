import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: "autoUpdate",
        manifest: {
          name: "Le Poulailler",
          short_name: "Poulailler",
          description: "Suivi de ponte et finances du poulailler",
          theme_color: "#f07b28",
          background_color: "#fff8f0",
          display: "standalone",
          orientation: "portrait",
          start_url: "/",
          icons: [
            {
              src: "/favicon.svg",
              sizes: "any",
              type: "image/svg+xml",
              purpose: "any maskable",
            },
          ],
        },
        workbox: {
          globPatterns: ["**/*.{js,css,html,svg,png,ico,woff2}"],
        },
      }),
    ],
    server: {
      proxy: {
        "/api": {
          target: env.VITE_API_URL || "http://localhost:3002",
          changeOrigin: true,
        },
      },
    },
  };
});
