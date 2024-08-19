import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { Lucia } from "lucia";
import { OAuth2Client } from "oslo/oauth2";
import { db, sessionTable, userTable } from "./db";
import type { InferSelectModel } from "drizzle-orm";
import type { Tokens } from "arctic";

export const adapter = new DrizzleSQLiteAdapter(db, sessionTable, userTable);

export const lucia = new Lucia(adapter, {
  getUserAttributes: (attributes) => {
    return {
      name: attributes.name,
      id: attributes.id,
    };
  },
  getSessionAttributes: (attributes) => {
    return {
      accessToken: attributes.accessToken,
    };
  },
  sessionCookie: {
    attributes: {
      secure: import.meta.env.PROD,
    },
  },
});

export const TOKEN_ENDPOINT = `${import.meta.env.MASTODON_URL}/oauth/token`;

export const client = new OAuth2Client(
  import.meta.env.MASTODON_CLIENT_ID,
  `${import.meta.env.MASTODON_URL}/oauth/authorize`,
  TOKEN_ENDPOINT,
  { redirectURI: import.meta.env.MASTODON_REDIRECT_URL },
);

declare module "lucia" {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: InferSelectModel<typeof userTable>;
    DatabaseSessionAttributes: Pick<Tokens, "accessToken">;
  }
}
