import {
	and,
	eq,
	inArray,
	type InferSelectModel,
	isNull,
	gte,
	lt,
} from "drizzle-orm";
import { bookmarkTable, db } from "./db";
import { validateContextSession } from "./auth";
import type { ActionAPIContext } from "astro/actions/runtime/store.js";
import { ActionError } from "astro:actions";
import { DB_ERROR } from "./errors";
import type { mastodon } from "masto";

type FindMastoBookmarksArgs = {
	mastoBookmarks: mastodon.v1.Status[];
};

export const findMastoBookmarks = (
	context: ActionAPIContext,
	{ mastoBookmarks }: FindMastoBookmarksArgs,
) => {
	const session = validateContextSession(context);

	const mastoIds = mastoBookmarks.map((bookmark) => bookmark.id);

	const response = db
		.select()
		.from(bookmarkTable)
		.where(
			and(
				inArray(bookmarkTable.mastoBookmarkId, mastoIds),
				eq(bookmarkTable.userId, session.userId),
			),
		)
		.all();

	const map = new Map<string, InferSelectModel<typeof bookmarkTable>>();

	for (const bookmark of response) {
		if (bookmark.mastoBookmarkId) {
			map.set(bookmark.mastoBookmarkId, bookmark);
		}
	}

	return map;
};

type FindBookmarksArgs = {
	from?: Date;
	to?: Date;
};

export const findBookmarks = (
	context: ActionAPIContext,
	{ from, to }: FindBookmarksArgs,
) => {
	const session = validateContextSession(context);

	return db
		.select()
		.from(bookmarkTable)
		.where(
			and(
				isNull(bookmarkTable.mastoBookmarkId),
				eq(bookmarkTable.userId, session.userId),
				from ? gte(bookmarkTable.createdAt, from) : undefined,
				to ? lt(bookmarkTable.createdAt, to) : undefined,
			),
		)
		.all();
};

type CreateBookmarkArgs = {
	content: string;
};

export const createBookmark = (
	context: ActionAPIContext,
	{ content }: CreateBookmarkArgs,
) => {
	const session = validateContextSession(context);

	const result = db
		.insert(bookmarkTable)
		.values({
			content,
			userId: session.userId,
			createdAt: new Date(),
			id: crypto.randomUUID(),
		})
		.run();

	if (result.changes === 0) {
		throw new ActionError(DB_ERROR);
	}

	return result;
};

type UpdateBookmarkArgs = {
	content: string;
	priority: number;
	done: boolean;
	bookmarkId: string;
};

export const updateBookmark = (
	context: ActionAPIContext,
	{ content, done, priority, bookmarkId }: UpdateBookmarkArgs,
) => {
	const session = validateContextSession(context);

	const result = db
		.update(bookmarkTable)
		.set({ content, done, priority })
		.where(
			and(
				eq(bookmarkTable.id, bookmarkId),
				eq(bookmarkTable.userId, session.userId),
			),
		)
		.run();

	if (result.changes === 0) {
		throw new ActionError(DB_ERROR);
	}

	return result;
};

type DeleteBookmarkArgs = {
	tagId: string;
};

export const deleteBookmark = (
	context: ActionAPIContext,
	{ tagId }: DeleteBookmarkArgs,
) => {
	const session = validateContextSession(context);

	const result = db
		.delete(bookmarkTable)
		.where(
			and(
				eq(bookmarkTable.id, tagId),
				eq(bookmarkTable.userId, session.userId),
			),
		)
		.run();

	if (result.changes === 0) {
		throw new ActionError(DB_ERROR);
	}

	return result;
};
