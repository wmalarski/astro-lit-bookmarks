import { defineAction, z } from "astro:actions";
import { createTag, deleteTag, updateTag } from "@server/tags";

export const tags = {
	createTag: defineAction({
		accept: "json",
		input: z.object({ name: z.string() }),
		handler: async (args, context) => {
			const tag = createTag(context, args);
			return { success: true, tag };
		},
	}),
	updateTag: defineAction({
		accept: "form",
		input: z.object({ tagId: z.string(), name: z.string() }),
		handler: async (args, context) => {
			updateTag(context, args);
			return { success: true };
		},
	}),
	deleteReview: defineAction({
		accept: "form",
		input: z.object({ tagId: z.string() }),
		handler: async (args, context) => {
			deleteTag(context, args);
			return { success: true };
		},
	}),
};
