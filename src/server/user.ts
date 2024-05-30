import { db, userTable } from "./db";
import { eq } from "drizzle-orm";
import { createRestAPIClient } from "masto";
import type { Tokens } from "arctic";

export const verifyMastoCredentials = (tokens: Tokens) => {
	const client = createRestAPIClient({
		url: import.meta.env.MASTODON_URL,
		accessToken: tokens.accessToken,
	});

	return client.v1.accounts.verifyCredentials();
};

export const getUserByMastoId = (id: string) => {
	return db.select().from(userTable).where(eq(userTable.id, id)).get();
};

type AccountCredentials = Awaited<ReturnType<typeof verifyMastoCredentials>>;

export const insertUser = (accountCredentials: AccountCredentials) => {
	const values = {
		id: accountCredentials.id,
		name: accountCredentials.displayName,
	};

	return db.insert(userTable).values(values).returning().get();
};
