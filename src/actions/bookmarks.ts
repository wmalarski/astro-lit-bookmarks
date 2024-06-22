import { defineAction, z } from "astro:actions";
import { createBookmarkTags, deleteBookmarkTag } from "@server/bookmarkTags";
import { createBookmark } from "@server/bookmarks";

export const bookmarks = {
	createBookmark: defineAction({
		accept: "json",
		input: z.object({
			mastoBookmarkId: z.string(),
			tagIds: z.array(z.string()),
		}),
		handler: (args, context) => {
			const bookmark = createBookmark(context, {
				content: "",
				mastoBookmarkId: args.mastoBookmarkId,
				priority: 0,
			});

			const bookmarkTags = createBookmarkTags(context, {
				bookmarkId: bookmark.id,
				tagIds: args.tagIds,
			});

			return { bookmark, bookmarkTags };
		},
	}),
	createBookmarkTags: defineAction({
		accept: "json",
		input: z.object({ bookmarkId: z.string(), tagIds: z.array(z.string()) }),
		handler: (args, context) => createBookmarkTags(context, args),
	}),
	removeBookmarkTag: defineAction({
		accept: "json",
		input: z.object({ bookmarkTagId: z.string() }),
		handler: (args, context) => deleteBookmarkTag(context, args),
	}),
};
