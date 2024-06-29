import { defineConfig } from "astro/config";
import AstroPWA from "@vite-pwa/astro";
import lit from "@astrojs/lit";

import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
	output: "server",
	// vite: {
	// 	server: {
	// 		fs: {
	// 			// Allow serving files from hoisted root node_modules
	// 			allow: ["../.."],
	// 		},
	// 	},
	// },
	integrations: [
		lit(),
		AstroPWA({
			mode: "development",
			base: "/",
			scope: "/",
			includeAssets: ["favicon.svg"],
			registerType: "autoUpdate",
			manifest: {
				name: "Lit Bookmarks",
				short_name: "Lit Bookmarks",
				theme_color: "#ffffff",
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
			},
			workbox: {
				navigateFallback: "/",
			},
			devOptions: {
				enabled: true,
				navigateFallbackAllowlist: [/^\//],
			},
			experimental: {
				directoryAndTrailingSlashHandler: true,
			},
		}),
	],
	experimental: {
		actions: true,
	},
	adapter: node({
		mode: "standalone",
	}),
});
