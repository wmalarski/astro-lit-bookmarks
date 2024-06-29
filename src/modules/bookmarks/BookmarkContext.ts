import { createContext } from "@lit/context";
import type { MatchBookmarksResult } from "../../server/matchBookmarks";
import type { mastodon } from "masto";
import type { Status } from "@type/mastodon";

export type BookmarkContextValue = {
	bookmarks: MatchBookmarksResult[];
	isPending: boolean;
	error: string | null;
	removingBookmarkId: string | null;
	paginator: mastodon.Paginator<
		Status[],
		mastodon.DefaultPaginationParams
	> | null;
	showDone: boolean;
	startDate: Date | null;
	minId: string | null;
};

export const bookmarkContext = createContext<BookmarkContextValue>("bookmark");

export const bookmarkContextDefault: BookmarkContextValue = {
	isPending: false,
	bookmarks: [],
	error: null,
	removingBookmarkId: null,
	paginator: null,
	showDone: false,
	minId: null,
	startDate: null,
};
