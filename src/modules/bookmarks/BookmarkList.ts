import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { MatchBookmarksResult } from "./matchBookmarks";
import type { InferSelectModel } from "drizzle-orm";
import type { tagTable } from "@server/db";
import "./BookmarkItem";

type BookmarkListProps = {
	bookmarks: MatchBookmarksResult[];
	tags: InferSelectModel<typeof tagTable>[];
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type BookmarkListComponent = (props: BookmarkListProps) => any;

@customElement("alb-bookmark-list")
export class BookmarkList extends LitElement {
	@property({ attribute: false })
	bookmarks: MatchBookmarksResult[] = [];

	@property({ attribute: false })
	tags: InferSelectModel<typeof tagTable>[] = [];

	override render() {
		return html`
			<ul>
				${this.bookmarks.map(
					({ bookmark, mastoBookmark, tags }) => html`
						<alb-bookmark-item 
							.bookmark=${bookmark}
							.mastoBookmark=${mastoBookmark}
							.tags=${tags}
							.allTags=${this.tags}
						></alb-bookmark-item>
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
