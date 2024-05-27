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

const authorizeEndpoint = "https://github.com/login/oauth/authorize";
const tokenEndpoint = "https://github.com/login/oauth/access_token";

export const client = new OAuth2Client(
	import.meta.env.CLIENT_ID,
	authorizeEndpoint,
	tokenEndpoint,
	{ redirectURI: "http://localhost:3000/login/github/callback" },
);

declare module "lucia" {
	// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: InferSelectModel<typeof userTable>;
	}
}
