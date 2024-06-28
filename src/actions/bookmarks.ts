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
			console.log("handler", { args });

			if (!context.locals.session) {
				return { mastoBookmarks: [] };
			}

			const response = await fetch(
				`${import.meta.env.MASTODON_URL}/api/v1/bookmarks`,
				{
					headers: {
						Authorization: `bearer ${context.locals.session.accessToken}`,
					},
				},
			);

			const link = response.headers.get("link");

			const mastoBookmarks = await response.json();

			console.log({ link, mastoBookmarks });

			if (!mastoBookmarks) {
				return { matchedBookmarks: [] };
			}

			const bookmarksForMasto = findBookmarksByMastoIds(context, {
				mastoBookmarks,
			});

			const { startDate, minId } = getMastoBookmarkStartDate(mastoBookmarks);

			console.log("handler", { startDate, minId });

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
