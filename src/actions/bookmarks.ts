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
		handler: (args, context) =>
			createBookmark(context, {
				content: "",
				mastoBookmarkId: args.mastoBookmarkId,
				priority: 0,
				tagIds: args.tagIds,
			}),
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
