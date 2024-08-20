import { createContext } from "@lit/context";
import type { MatchBookmarksResult } from "../../server/data/matchBookmarks";

export type BookmarkContextValue = {
  bookmarks: MatchBookmarksResult[];
  isPending: boolean;
  error: string | null;
  removingBookmarkId: string | null;
  showDone: boolean;
  startDate: Date | null;
  minId: string | null;
  maxId: string | null;
};

export const bookmarkContext = createContext<BookmarkContextValue>("bookmark");

export const bookmarkContextDefault: BookmarkContextValue = {
  isPending: false,
  bookmarks: [],
  error: null,
  removingBookmarkId: null,
  showDone: false,
  minId: null,
  maxId: null,
  startDate: null,
};
