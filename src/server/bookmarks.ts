import { and, eq, inArray, isNull, gte, lt } from "drizzle-orm";
import { bookmarkTable, bookmarkTagTable, db } from "./db";
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

	if (mastoBookmarks.length === 0) {
		return [];
	}

	const mastoIds = mastoBookmarks.map((bookmark) => bookmark.id);

	return db
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
		.all();
};

export type FindBookmarksByMastoIdsResult = ReturnType<
	typeof findBookmarksByMastoIds
>;

type FindBookmarkArgs = {
	id: string;
};

export const findBookmark = (
	context: ActionAPIContext,
	{ id }: FindBookmarkArgs,
) => {
	const session = validateContextSession(context);

	return db
		.select()
		.from(bookmarkTable)
		.where(
			and(eq(bookmarkTable.userId, session.userId), eq(bookmarkTable.id, id)),
		)
		.get();
};

export type FindBookmarkResult = ReturnType<typeof findBookmark>;

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
		.leftJoin(
			bookmarkTagTable,
			eq(bookmarkTable.id, bookmarkTagTable.bookmarkId),
		)
		.all();
};

export type FindBookmarksResult = ReturnType<typeof findBookmarks>;

type CreateBookmarkArgs = {
	content: string;
	mastoBookmarkId: string | null;
	priority: number;
	done: boolean;
};

export const createBookmark = (
	context: ActionAPIContext,
	{ content, mastoBookmarkId, priority, done }: CreateBookmarkArgs,
) => {
	const session = validateContextSession(context);

	const bookmarkId = crypto.randomUUID();
	const result = db
		.insert(bookmarkTable)
		.values({
			content,
			userId: session.userId,
			createdAt: new Date(),
			done,
			id: bookmarkId,
			mastoBookmarkId,
			priority,
		})
		.returning()
		.get();

	if (!result) {
		throw new ActionError(DB_ERROR);
	}

	return result;
};

type FindOrCreateBookmarkArgs = CreateBookmarkArgs & {
	id?: string | undefined;
};

export const findOrCreateBookmark = (
	context: ActionAPIContext,
	{ id, ...createArgs }: FindOrCreateBookmarkArgs,
) => {
	return id
		? findBookmark(context, { id }) ?? createBookmark(context, createArgs)
		: createBookmark(context, createArgs);
};

export type FindOrCreateBookmarkResult = ReturnType<
	typeof findOrCreateBookmark
>;

type UpdateBookmarkArgs = {
	content: string | null;
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
		.returning()
		.get();

	if (!result) {
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
		.returning()
		.get();

	if (!result) {
		throw new ActionError(DB_ERROR);
	}

	return result;
};
