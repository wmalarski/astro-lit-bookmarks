import { createTag, deleteTag } from "@server/data/tags";
import { z } from "astro/zod";
import { defineAction } from "astro:actions";

export const tags = {
  createTag: defineAction({
    accept: "form",
    input: z.object({ name: z.string() }),
    handler: (args, context) => createTag(context, args),
  }),
  deleteTag: defineAction({
    accept: "form",
    input: z.object({ tagId: z.string() }),
    handler: (args, context) => deleteTag(context, args),
  }),
};
