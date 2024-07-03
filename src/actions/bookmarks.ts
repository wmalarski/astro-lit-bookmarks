import { defineAction, z } from "astro:actions";
import { createBookmarkTags, deleteBookmarkTag } from "@server/bookmarkTags";
import {
	deleteBookmark,
	findBookmarks,
	findBookmarksByMastoIds,
	findOrCreateBookmark,
	updateBookmark,
} from "@server/bookmarks";
import { matchBookmarks } from "@server/matchBookmarks";
import { listMastoBookmarks } from "@server/masto";

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
				content: null,
				title: null,
				url: null,
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
	removeBookmark: defineAction({
		accept: "json",
		input: z.object({ bookmarkId: z.string() }),
		handler: (args, context) => deleteBookmark(context, args),
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
			done: z.coerce.boolean(),
		}),
		handler: (args, context) => {
			const bookmark = findOrCreateBookmark(context, {
				mastoBookmarkId: args.mastoBookmarkId ?? null,
				content: null,
				title: null,
				url: null,
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
			done: z.coerce.boolean(),
			maxId: z.string(),
			endDate: z.coerce.date(),
		}),
		handler: async (args, context) => {
			const { mastoBookmarks, minId, startDate, maxId } =
				await listMastoBookmarks(context, { maxId: args.maxId });

			const bookmarksForMasto = findBookmarksByMastoIds(context, {
				mastoBookmarks,
			});

			const bookmarksResult = findBookmarks(context, {
				done: args.done,
				endDate: args.endDate,
				startDate,
			});

			const matchedBookmarks = matchBookmarks({
				bookmarksForMasto,
				bookmarksResult,
				mastoBookmarks,
			});

			return { matchedBookmarks, startDate, minId, maxId };
		},
	}),
};
