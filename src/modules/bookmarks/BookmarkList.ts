import type { bookmarkTable, tagTable } from "@server/db";
import type { InferSelectModel } from "drizzle-orm";
import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { mastodon } from "masto";
import "./BookmarkItem";
import "./MastoBookmarkItem";
import type {
	FindBookmarksByMastoIdsResult,
	FindBookmarksResult,
} from "@server/bookmarks";

type BookmarkListProps = {
	mastoBookmarks: FindBookmarksByMastoIdsResult;
	bookmarks: FindBookmarksResult;
	tags: InferSelectModel<typeof tagTable>[];
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type BookmarkListComponent = (props: BookmarkListProps) => any;

@customElement("alb-bookmark-list")
export class BookmarkList extends LitElement {
	@property({ attribute: false })
	mastoBookmarks: mastodon.v1.Status[] = [];

	@property({ attribute: false })
	bookmarks: InferSelectModel<typeof bookmarkTable>[] = [];

	@property({ attribute: false })
	tags: Map<string, InferSelectModel<typeof tagTable>> = new Map();

	override render() {
		return html`
			<ul>
				${this.mastoBookmarks.map(
					(bookmark) => html`
						<alb-masto-bookmark-item mastoBookmark=${bookmark}>
						</alb-masto-bookmark-item>
					`,
				)}
				${this.bookmarks.map(
					(bookmark) => html`
						<alb-bookmark-item .bookmark=${bookmark}>
						</alb-bookmark-item>
					`,
				)}
			</ul>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"alb-bookmark-list": BookmarkList;
	}
}

export const TypedBookmarkList =
	BookmarkList as unknown as BookmarkListComponent;
