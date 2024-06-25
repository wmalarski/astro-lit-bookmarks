import { defineAction, z } from "astro:actions";
import { createBookmarkTags, deleteBookmarkTag } from "@server/bookmarkTags";
import {
	findBookmarks,
	findBookmarksByMastoIds,
	findOrCreateBookmark,
	updateBookmark,
} from "@server/bookmarks";
import {
	getMastoBookmarkStartDate,
	matchBookmarks,
} from "@server/matchBookmarks";

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
			done: z.coerce.boolean(),
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
			done: z.coerce.boolean(),
			maxId: z.string(),
			endDate: z.coerce.date(),
		}),
		handler: async (args, context) => {
			const mastoBookmarks =
				await context.locals.mastoClient?.v1.bookmarks.list({
					limit: 10,
					maxId: args.maxId,
				});

			if (!mastoBookmarks) {
				return null;
			}

			const bookmarksForMasto = findBookmarksByMastoIds(context, {
				mastoBookmarks,
			});

			const { startDate, minId } = getMastoBookmarkStartDate(mastoBookmarks);
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

			return { matchedBookmarks, startDate, minId };
		},
	}),
};
