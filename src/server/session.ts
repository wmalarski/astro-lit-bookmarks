import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { Lucia } from "lucia";
import { OAuth2Client } from "oslo/oauth2";
import { db, sessionTable, userTable } from "./db";
import type { InferSelectModel } from "drizzle-orm";

export const adapter = new DrizzleSQLiteAdapter(db, sessionTable, userTable);

export const lucia = new Lucia(adapter, {
	getUserAttributes: (attributes) => {
		return {
			name: attributes.name,
			id: attributes.id,
		};
	},
	sessionCookie: {
		attributes: {
			secure: import.meta.env.PROD,
		},
	},
});

export const client = new OAuth2Client(
	import.meta.env.MASTODON_CLIENT_ID,
	`${import.meta.env.MASTODON_AUTHORIZE_ENDPOINT}/oauth/authorize`,
	`${import.meta.env.MASTODON_TOKEN_ENDPOINT}/oauth/token`,
	{ redirectURI: import.meta.env.MASTODON_REDIRECT_URL },
);

declare module "lucia" {
	// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: InferSelectModel<typeof userTable>;
	}
}
