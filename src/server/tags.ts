import { eq } from "drizzle-orm";
import { db, tagTable } from "./db";
import { validateContextSession } from "./auth";
import type { ActionAPIContext } from "astro/actions/runtime/store.js";
import { ActionError } from "astro:actions";
import { DB_ERROR } from "./errors";
import type { APIContext } from "astro";

const TAG_LIMIT = 100;

export const findTags = (context: APIContext) => {
	validateContextSession(context);

	return db.select().from(tagTable).limit(TAG_LIMIT).all();
};

type CreateTagArgs = {
	name: string;
};

export const createTag = (
	context: ActionAPIContext,
	{ name }: CreateTagArgs,
) => {
	validateContextSession(context);

	const result = db
		.insert(tagTable)
		.values({ name, id: crypto.randomUUID() })
		.run();

	if (result.changes === 0) {
		throw new ActionError(DB_ERROR);
	}

	return result;
};

type UpdateTagArgs = {
	name: string;
	tagId: string;
};

export const updateTag = (
	context: ActionAPIContext,
	{ name, tagId }: UpdateTagArgs,
) => {
	validateContextSession(context);

	const result = db
		.update(tagTable)
		.set({ name })
		.where(eq(tagTable.id, tagId))
		.run();

	if (result.changes === 0) {
		throw new ActionError(DB_ERROR);
	}

	return result;
};

type DeleteTagArgs = {
	tagId: string;
};

export const deleteTag = (
	context: ActionAPIContext,
	{ tagId }: DeleteTagArgs,
) => {
	validateContextSession(context);

	const result = db.delete(tagTable).where(eq(tagTable.id, tagId)).run();

	if (result.changes === 0) {
		throw new ActionError(DB_ERROR);
	}

	return result;
};
