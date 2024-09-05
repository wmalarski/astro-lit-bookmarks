import node from "@astrojs/node";
import AstroPWA from "@vite-pwa/astro";
import { defineConfig } from "astro/config";

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  output: "server",
  integrations: [
    AstroPWA({
      // mode: "development",
      // base: "/",
      // scope: "/",
      includeAssets: ["favicon.svg"],
      // registerType: "autoUpdate",
      manifest: {
        name: "Lit Bookmarks",
        short_name: "Lit Bookmarks",
        theme_color: "#afffff",
        start_url: "/",
        background_color: "#eeeeee",
        display: "standalone",
        description: "Lit Bookmarks",
        orientation: "portrait",
        display_override: ["standalone"],
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
        share_target: {
          action: "/share-target/",
          enctype: "multipart/form-data",
          method: "POST",
          params: {
            title: "title",
            text: "text",
            url: "url",
          },
        },
      },
      // workbox: {},
      // devOptions: {
      // 	enabled: true,
      // },
    }),
    tailwind(),
  ],
  adapter: node({
    mode: "standalone",
  }),
});
