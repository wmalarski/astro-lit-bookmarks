import { createContext } from "@lit/context";
import type { MatchBookmarksResult } from "./matchBookmarks";

export type BookmarkContextValue = {
	bookmarks: MatchBookmarksResult[];
	isPending: boolean;
	error: string | null;
	removingBookmarkId: string | null;
	page: number;
};

export const bookmarkContext = createContext<BookmarkContextValue>("bookmark");

export const bookmarkContextDefault: BookmarkContextValue = {
	isPending: false,
	bookmarks: [],
	error: null,
	removingBookmarkId: null,
	page: 0,
};
