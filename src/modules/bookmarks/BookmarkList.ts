import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { MatchBookmarksResult } from "./matchBookmarks";
import "./BookmarkItem";

type BookmarkListProps = {
	bookmarks: MatchBookmarksResult[];
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type BookmarkListComponent = (props: BookmarkListProps) => any;

@customElement("alb-bookmark-list")
export class BookmarkList extends LitElement {
	@property({ attribute: false })
	bookmarks: MatchBookmarksResult[] = [];

	override render() {
		return html`
			<ul>
				${this.bookmarks.map(
					({ bookmark, mastoBookmark, tags }) => html`
						<alb-bookmark-item 
							.bookmark=${bookmark}
							.mastoBookmark=${mastoBookmark}
							.tags=${tags}
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
