import {
  createBookmarkTags,
  deleteBookmarkTag,
} from "@server/data/bookmarkTags";
import {
  deleteBookmark,
  findBookmarks,
  findBookmarksByMastoIds,
  findOrCreateBookmark,
  updateBookmark,
} from "@server/data/bookmarks";
import { matchBookmarks } from "@server/data/matchBookmarks";
import { listMastoBookmarks } from "@server/masto/helpers";
import { defineAction } from "astro:actions";
import { z } from "astro:schema";

export const bookmarks = {
  createBookmarkTags: defineAction({
    accept: "form",
    input: z.object({
      bookmarkId: z.string().optional(),
      mastoBookmarkId: z.string().optional(),
      tagIds: z.array(z.string()),
    }),
    handler: (args, context) => {
      const bookmark = findOrCreateBookmark(context, {
        content: null,
        title: null,
        url: null,
        mastoBookmarkId: args.mastoBookmarkId ?? null,
        priority: 0,
        done: false,
        id: args.bookmarkId,
      });

      const bookmarkTags = createBookmarkTags(context, {
        bookmarkId: args.bookmarkId ?? bookmark?.id,
        tagIds: args.tagIds,
      });

      return { bookmark, bookmarkTags };
    },
  }),
  removeBookmark: defineAction({
    accept: "json",
    input: z.object({ bookmarkId: z.string() }),
    handler: (args, context) => deleteBookmark(context, args),
  }),
  removeBookmarkTag: defineAction({
    accept: "form",
    input: z.object({ bookmarkTagId: z.string() }),
    handler: (args, context) => deleteBookmarkTag(context, args),
  }),
  updateBookmarkDone: defineAction({
    accept: "json",
    input: z.object({
      bookmarkId: z.string().optional(),
      mastoBookmarkId: z.string().optional(),
      done: z.coerce.boolean(),
    }),
    handler: (args, context) => {
      const bookmark = findOrCreateBookmark(context, {
        mastoBookmarkId: args.mastoBookmarkId ?? null,
        content: null,
        title: null,
        url: null,
        done: args.done,
        priority: 0,
        id: args.bookmarkId,
      });

      return updateBookmark(context, {
        bookmarkId: bookmark.id,
        content: bookmark.content,
        done: args.done,
        priority: bookmark.priority,
      });
    },
  }),
  findBookmarks: defineAction({
    accept: "json",
    input: z.object({
      maxId: z.string(),
      endDate: z.coerce.date(),
      showDone: z.coerce.boolean(),
    }),
    handler: async (args, context) => {
      const { mastoBookmarks, minId, startDate, maxId } =
        await listMastoBookmarks(context, { maxId: args.maxId });

      const bookmarksForMasto = findBookmarksByMastoIds(context, {
        mastoBookmarks,
      });

      const bookmarksResult = findBookmarks(context, {
        endDate: args.endDate,
        startDate,
      });

      const matchedBookmarks = matchBookmarks({
        bookmarksForMasto,
        bookmarksResult,
        mastoBookmarks,
        showDone: args.showDone,
      });

      return { matchedBookmarks, startDate, minId, maxId };
    },
  }),
};
