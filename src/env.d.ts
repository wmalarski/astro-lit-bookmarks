/// <reference types="astro/client" />

declare namespace App {
	// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
	interface Locals {
		session: import("lucia").Session | null;
		user: import("lucia").User | null;
		mastoClient: ReturnType<typeof import("masto").createRestAPIClient> | null;
	}
}
