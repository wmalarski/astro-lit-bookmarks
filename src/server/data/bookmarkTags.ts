import { type ActionAPIContext, ActionError } from "astro:actions";
import { and, eq } from "drizzle-orm";
import { validateContextSession } from "../auth/middleware";
import { bookmarkTagTable, db } from "../db";
import { DB_ERROR } from "../errors";

type CreateBookmarkTagsArgs = {
  tagIds: string[];
  bookmarkId: string;
};

export const createBookmarkTags = (
  context: ActionAPIContext,
  { bookmarkId, tagIds }: CreateBookmarkTagsArgs,
) => {
  const session = validateContextSession(context);

  const result = db
    .insert(bookmarkTagTable)
    .values(
      tagIds.map((tagId) => ({
        bookmarkId,
        tagId,
        userId: session.userId,
        id: crypto.randomUUID(),
      })),
    )
    .returning()
    .all();

  if (result.length === 0) {
    throw new ActionError(DB_ERROR);
  }

  return result;
};

type DeleteBookmarkTagArgs = {
  bookmarkTagId: string;
};

export const deleteBookmarkTag = (
  context: ActionAPIContext,
  { bookmarkTagId }: DeleteBookmarkTagArgs,
) => {
  const session = validateContextSession(context);

  const result = db
    .delete(bookmarkTagTable)
    .where(
      and(
        eq(bookmarkTagTable.id, bookmarkTagId),
        eq(bookmarkTagTable.userId, session.userId),
      ),
    )
    .returning()
    .get();

  if (!result) {
    throw new ActionError(DB_ERROR);
  }

  return result;
};
