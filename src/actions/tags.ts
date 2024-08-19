import { createTag, deleteTag, updateTag } from "@server/tags";
import { defineAction, z } from "astro:actions";

export const tags = {
  createTag: defineAction({
    accept: "json",
    input: z.object({ name: z.string() }),
    handler: (args, context) => createTag(context, args),
  }),
  updateTag: defineAction({
    accept: "json",
    input: z.object({ tagId: z.string(), name: z.string() }),
    handler: (args, context) => updateTag(context, args),
  }),
  deleteTag: defineAction({
    accept: "json",
    input: z.object({ tagId: z.string() }),
    handler: (args, context) => deleteTag(context, args),
  }),
};
