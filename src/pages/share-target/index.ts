import { createBookmark } from "@server/data/bookmarks";
import { paths } from "@utils/paths";
import type { APIContext } from "astro";
import { z } from "astro/zod";

export const POST = async (context: APIContext): Promise<Response> => {
  const form = await context.request.formData();

  const schema = z.object({
    title: z.string().optional(),
    text: z.string().optional(),
    url: z.string().url().optional(),
  });

  const data = await schema.parseAsync(Object.fromEntries(form.entries()));

  createBookmark(context, {
    content: data.text ?? null,
    title: data.title ?? null,
    url: data.url ?? null,
    done: false,
    mastoBookmarkId: null,
    priority: 0,
  });

  return context.redirect(paths.index);
};
