import { createContext } from "@lit/context";
import type { MatchBookmarksResult } from "../../server/matchBookmarks";

export type BookmarkContextValue = {
	bookmarks: MatchBookmarksResult[];
	isPending: boolean;
	error: string | null;
	removingBookmarkId: string | null;
	startDate: Date;
	minId: string;
};

export const bookmarkContext = createContext<BookmarkContextValue>("bookmark");

export const bookmarkContextDefault: BookmarkContextValue = {
	isPending: false,
	bookmarks: [],
	error: null,
	removingBookmarkId: null,
	startDate: new Date(),
	minId: "",
};
