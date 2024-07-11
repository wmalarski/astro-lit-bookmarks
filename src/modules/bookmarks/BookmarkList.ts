import { LitElement, html } from "lit";
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
import { tailwindStyles } from "@styles/tailwind";

@customElement(BookmarkList.elementName)
export class BookmarkList extends LitElement {
	static readonly elementName = "bookmark-list" as const;

	@consume({ context: bookmarkContext, subscribe: true })
	bookmarkContext: BookmarkContextValue = bookmarkContextDefault;

	static override styles = tailwindStyles;

	override render() {
		return html`
			<div class="border-l-[1px] border-l-base-content">
				<ul class="flex flex-col">
					${repeat(
						this.bookmarkContext.bookmarks,
						(item) => item.bookmark?.id ?? item.mastoBookmark?.id,
						(item) =>
							html`<li><bookmark-item .item=${item}></bookmark-item></li>`,
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
