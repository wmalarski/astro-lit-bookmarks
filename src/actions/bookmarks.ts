import { defineAction, z } from "astro:actions";
import { createBookmarkTags, deleteBookmarkTag } from "@server/bookmarkTags";
import {
	DEFAULT_BOOKMARK_LIMIT,
	findBookmarks,
	findOrCreateBookmark,
	updateBookmark,
} from "@server/bookmarks";

export const bookmarks = {
	createBookmarkTags: defineAction({
		accept: "json",
		input: z.object({
			bookmarkId: z.string().optional(),
			mastoBookmarkId: z.string().optional(),
			tagIds: z.array(z.string()),
		}),
		handler: (args, context) => {
			const bookmark = findOrCreateBookmark(context, {
				content: "",
				mastoBookmarkId: args.mastoBookmarkId ?? null,
				priority: 0,
				done: false,
				id: args.bookmarkId,
			});

			const bookmarkTags = createBookmarkTags(context, {
				bookmarkId: args.bookmarkId ?? bookmark?.id,
				tagIds: args.tagIds,
			});

			return { bookmark, bookmarkTags };
		},
	}),
	removeBookmarkTag: defineAction({
		accept: "json",
		input: z.object({ bookmarkTagId: z.string() }),
		handler: (args, context) => deleteBookmarkTag(context, args),
	}),
	updateBookmarkDone: defineAction({
		accept: "json",
		input: z.object({
			bookmarkId: z.string().optional(),
			mastoBookmarkId: z.string().optional(),
			done: z.boolean(),
		}),
		handler: (args, context) => {
			const bookmark = findOrCreateBookmark(context, {
				mastoBookmarkId: args.mastoBookmarkId ?? null,
				content: "",
				done: args.done,
				priority: 0,
				id: args.bookmarkId,
			});

			return updateBookmark(context, {
				bookmarkId: bookmark.id,
				content: bookmark.content,
				done: args.done,
				priority: bookmark.priority,
			});
		},
	}),
	findBookmarks: defineAction({
		accept: "json",
		input: z.object({
			page: z.number().int().positive(),
			done: z.boolean(),
			orderBy: z.union([z.literal("date"), z.literal("priority")]),
		}),
		handler: (args, context) =>
			findBookmarks(context, {
				done: args.done,
				offset: DEFAULT_BOOKMARK_LIMIT * args.page,
				orderBy: args.orderBy,
			}),
	}),
};
