import { generateId } from "lucia";
import { db, userTable } from "./db";
import { eq } from "drizzle-orm";

export const getUserByGoogleId = (id: string) => {
	return db.select().from(userTable).where(eq(userTable.id, id)).get();
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const insertUser = (googleUser: any) => {
	const userId = generateId(15);

	const values = {
		id: userId,
		name: googleUser.name,
	};

	return db.insert(userTable).values(values).returning().get();
};
