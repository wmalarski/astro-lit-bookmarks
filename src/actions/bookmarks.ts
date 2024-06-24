import { defineAction, z } from "astro:actions";
import { createBookmarkTags, deleteBookmarkTag } from "@server/bookmarkTags";
import { createBookmark } from "@server/bookmarks";

export const bookmarks = {
	createBookmarkTags: defineAction({
		accept: "json",
		input: z.object({
			bookmarkId: z.string().optional(),
			mastoBookmarkId: z.string().optional(),
			tagIds: z.array(z.string()),
		}),
		handler: (args, context) => {
			if (args.bookmarkId) {
				const bookmarkTags = createBookmarkTags(context, {
					bookmarkId: args.bookmarkId,
					tagIds: args.tagIds,
				});

				return { bookmarkTags };
			}
			const bookmark = createBookmark(context, {
				content: "",
				mastoBookmarkId: args.mastoBookmarkId ?? null,
				priority: 0,
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
};
