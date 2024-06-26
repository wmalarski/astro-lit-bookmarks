import { createContext } from "@lit/context";
import type { MatchBookmarksResult } from "../../server/matchBookmarks";
import type { mastodon } from "masto";

export type BookmarkContextValue = {
	bookmarks: MatchBookmarksResult[];
	isPending: boolean;
	error: string | null;
	removingBookmarkId: string | null;
	paginator: mastodon.Paginator<
		mastodon.v1.Status[],
		mastodon.DefaultPaginationParams
	> | null;
	showDone: boolean;
};

export const bookmarkContext = createContext<BookmarkContextValue>("bookmark");

export const bookmarkContextDefault: BookmarkContextValue = {
	isPending: false,
	bookmarks: [],
	error: null,
	removingBookmarkId: null,
	paginator: null,
	showDone: false,
};
