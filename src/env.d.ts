/// <reference path="../.astro/types.d.ts" />
/// <reference path="../.astro/actions.d.ts" />
/// <reference types="astro/client" />
/// <reference types="vite-plugin-pwa/info" />
/// <reference types="vite-plugin-pwa/vanillajs" />

declare namespace App {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Locals {
    session: import("lucia").Session | null;
    user: import("lucia").User | null;
    mastoClient: ReturnType<typeof import("masto").createRestAPIClient> | null;
  }
}
