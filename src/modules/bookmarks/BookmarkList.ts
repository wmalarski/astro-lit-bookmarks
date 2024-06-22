import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";
import "./BookmarkItem";
import {
	bookmarkContext,
	bookmarkContextDefault,
	type BookmarkContextValue,
} from "./BookmarkContext";
import { consume } from "@lit/context";

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
			<ul>
				${this.bookmarkContext.bookmarks.map(
					(item) => html`
						<bookmark-item .item=${item}></bookmark-item>
					`,
				)}
			</ul>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		[BookmarkList.elementName]: BookmarkList;
	}
}
