import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA, VitePWAOptions } from "vite-plugin-pwa";

const manifestForPlugin: Partial<VitePWAOptions> = {
  registerType: "prompt",
  includeAssets: ["favicon.ico", "public/*"],
  manifest: {
    name: "Fobeno",
    start_url: "/",
    display: "standalone",
    background_color: "#fff",
    theme_color: "#000",
    screenshots: [
      {
        src: "screenshot640x320.png",
        sizes: "640x320",
        form_factor: "wide"
      },
      {
        src: "screenshot480x800.png",
        sizes: "480x800",
        form_factor: "narrow"
      }
    ],
    icons: [
      {
        src: "/icon.png",
        sizes: "192x192",
        type: "image/png"
      }
    ]
  }
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA(manifestForPlugin)],
});
