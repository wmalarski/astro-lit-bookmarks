import type {
	FindBookmarksByMastoIdsResult,
	FindBookmarksResult,
} from "@server/bookmarks";
import type { bookmarkTable, tagTable } from "@server/db";
import type { InferSelectModel } from "drizzle-orm";
import type { mastodon } from "masto";

type MatchBookmarksArgs = {
	mastoBookmarks: mastodon.v1.Status[];
	bookmarksForMasto: FindBookmarksByMastoIdsResult;
	bookmarksResult: FindBookmarksResult;
	tags: InferSelectModel<typeof tagTable>[];
};

export type MatchBookmarksResult = {
	bookmark: InferSelectModel<typeof bookmarkTable> | null;
	mastoBookmark: mastodon.v1.Status | null;
	tags: InferSelectModel<typeof tagTable>[];
};

export const matchBookmarks = ({
	mastoBookmarks,
	bookmarksResult,
	bookmarksForMasto,
	tags,
}: MatchBookmarksArgs): MatchBookmarksResult[] => {
	const tagsMap = new Map(tags.map((tag) => [tag.id, tag]));

	const bookmarks = new Map<string, InferSelectModel<typeof bookmarkTable>>();
	const bookmarkTags = new Map<string, InferSelectModel<typeof tagTable>[]>();

	for (const entry of bookmarksForMasto) {
		const mastoBookmarkId = entry.bookmark.mastoBookmarkId;
		if (!mastoBookmarkId) {
			continue;
		}

		bookmarks.set(mastoBookmarkId, entry.bookmark);
	}

	for (const entry of [...bookmarksResult, ...bookmarksForMasto]) {
		const tagId = entry.bookmark_tag?.tagId;
		if (!tagId) {
			continue;
		}

		const tag = tagsMap.get(tagId);
		if (!tag) {
			continue;
		}

		const bookmarkId = entry.bookmark.id;
		const tags = bookmarkTags.get(bookmarkId);

		if (tags) {
			tags.push(tag);
		} else {
			bookmarkTags.set(bookmarkId, [tag]);
		}
	}

	const fromMasto = mastoBookmarks.map((mastoBookmark) => {
		const bookmark = bookmarks.get(mastoBookmark.id);
		return {
			bookmark: bookmark ?? null,
			mastoBookmark,
			tags: bookmark ? bookmarkTags.get(bookmark.id) ?? [] : [],
		};
	});

	const fromDb = bookmarksResult.map(({ bookmark }) => ({
		bookmark,
		mastoBookmark: null,
		tags: bookmarkTags.get(bookmark.id) ?? [],
	}));

	return [...fromMasto, ...fromDb];
};
