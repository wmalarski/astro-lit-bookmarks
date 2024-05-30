import { defineAction, z } from "astro:actions";
import { createTag, deleteTag, updateTag } from "@server/tags";

export const tags = {
	createTag: defineAction({
		accept: "form",
		input: z.object({ name: z.string() }),
		handler: async (args, context) => {
			createTag(context, args);
			return { success: true };
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
