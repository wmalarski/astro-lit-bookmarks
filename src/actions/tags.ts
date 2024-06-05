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
		accept: "json",
		input: z.object({ tagId: z.string(), name: z.string() }),
		handler: async (args, context) => {
			const tag = updateTag(context, args);
			return { success: true, tag };
		},
	}),
	deleteTag: defineAction({
		accept: "json",
		input: z.object({ tagId: z.string() }),
		handler: async (args, context) => {
			const tag = deleteTag(context, args);
			return { success: true, tag };
		},
	}),
};
