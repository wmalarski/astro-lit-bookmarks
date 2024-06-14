import { defineAction, z } from "astro:actions";
import { createBookmarkTags } from "@server/bookmarkTags";
import { createBookmark } from "@server/bookmarks";

export const bookmarks = {
	createBookmark: defineAction({
		accept: "json",
		input: z.object({
			mastoBookmarkId: z.string(),
			tagIds: z.array(z.string()),
		}),
		handler: async (args, context) => {
			createBookmark(context, {
				content: "",
				mastoBookmarkId: args.mastoBookmarkId,
				priority: 0,
				tagIds: args.tagIds,
			});
			return { success: true };
		},
	}),
	createMastoBookmark: defineAction({
		accept: "json",
		input: z.object({ bookmarkId: z.string(), tagIds: z.array(z.string()) }),
		handler: async (args, context) => {
			createBookmarkTags(context, args);
			return { success: true };
		},
	}),
};
