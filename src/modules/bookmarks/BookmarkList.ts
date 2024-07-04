import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import "@components/Button/Button";
import "./BookmarkItem";
import {
	bookmarkContext,
	bookmarkContextDefault,
	type BookmarkContextValue,
} from "./BookmarkContext";
import { consume } from "@lit/context";
import { LoadMoreBookmarksEvent } from "./events";

@customElement(BookmarkList.elementName)
export class BookmarkList extends LitElement {
	static readonly elementName = "bookmark-list" as const;

	@consume({ context: bookmarkContext, subscribe: true })
	bookmarkContext: BookmarkContextValue = bookmarkContextDefault;

	static override styles = css`
		ul {
			margin: 0;
			padding: 0;
			list-style-type: none;
			border-left: var(--border);
			border-right: var(--border);
		}
	`;

	override render() {
		return html`
			<div>
				<ul>
					${repeat(
						this.bookmarkContext.bookmarks,
						(item) => item.bookmark?.id ?? item.mastoBookmark?.id,
						(item) => html`<bookmark-item .item=${item}></bookmark-item>`,
					)}
				</ul>
				<alb-button @click=${this.onLoadMoreClick}>
					Load more
				</alb-button>
			</div>
		`;
	}

	onLoadMoreClick() {
		this.dispatchEvent(new LoadMoreBookmarksEvent());
	}
}

declare global {
	interface HTMLElementTagNameMap {
		[BookmarkList.elementName]: BookmarkList;
	}
}
