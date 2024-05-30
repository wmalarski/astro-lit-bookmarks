import {
	and,
	eq,
	inArray,
	type InferSelectModel,
	isNull,
	gte,
	lt,
} from "drizzle-orm";
import { bookmarkTable, bookmarkTagTable, db, tagTable } from "./db";
import { validateContextSession } from "./auth";
import type { ActionAPIContext } from "astro/actions/runtime/store.js";
import { ActionError } from "astro:actions";
import { DB_ERROR } from "./errors";
import type { mastodon } from "masto";

type FindMastoBookmarksArgs = {
	mastoBookmarks: mastodon.v1.Status[];
};

export const findBookmarksByMastoIds = (
	context: ActionAPIContext,
	{ mastoBookmarks }: FindMastoBookmarksArgs,
) => {
	const session = validateContextSession(context);
	const bookmarks = new Map<string, InferSelectModel<typeof bookmarkTable>>();
	const tags = new Map<string, InferSelectModel<typeof tagTable>[]>();

	if (mastoBookmarks.length === 0) {
		return { bookmarks, tags };
	}

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
		.leftJoin(
			bookmarkTagTable,
			eq(bookmarkTable.id, bookmarkTagTable.bookmarkId),
		)
		.leftJoin(tagTable, eq(bookmarkTagTable.tagId, tagTable.id))
		.all();

	for (const entry of response) {
		const mastoBookmarkId = entry.bookmark.mastoBookmarkId;
		if (mastoBookmarkId) {
			bookmarks.set(mastoBookmarkId, entry.bookmark);

			if (entry.tag) {
				const array = tags.get(mastoBookmarkId);

				if (array) {
					array.push(entry.tag);
				} else {
					tags.set(mastoBookmarkId, [entry.tag]);
				}
			}
		}
	}

	return { bookmarks, tags };
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

	const response = db
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
		.leftJoin(
			bookmarkTagTable,
			eq(bookmarkTable.id, bookmarkTagTable.bookmarkId),
		)
		.leftJoin(tagTable, eq(bookmarkTagTable.tagId, tagTable.id))
		.all();

	const bookmarks = new Array<InferSelectModel<typeof bookmarkTable>>();
	const tags = new Map<string, InferSelectModel<typeof tagTable>[]>();

	for (const entry of response) {
		bookmarks.push(entry.bookmark);

		if (entry.tag) {
			const array = tags.get(entry.bookmark.id);

			if (array) {
				array.push(entry.tag);
			} else {
				tags.set(entry.bookmark.id, [entry.tag]);
			}
		}
	}

	return { bookmarks, tags };
};

type CreateBookmarkArgs = {
	content: string;
	mastoBookmarkId: string | null;
	priority: number;
	tagIds: string[];
};

export const createBookmark = async (
	context: ActionAPIContext,
	{ content, mastoBookmarkId, priority }: CreateBookmarkArgs,
) => {
	const session = validateContextSession(context);

	const bookmarkId = crypto.randomUUID();
	const result = await db
		.insert(bookmarkTable)
		.values({
			content,
			userId: session.userId,
			createdAt: new Date(),
			id: bookmarkId,
			mastoBookmarkId,
			priority,
		})
		.returning()
		.execute();

	if (result.length === 0) {
		throw new ActionError(DB_ERROR);
	}

	return result[1];
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
