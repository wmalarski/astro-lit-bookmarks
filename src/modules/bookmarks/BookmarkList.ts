import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import "./BookmarkItem";
import {
	bookmarkContext,
	bookmarkContextDefault,
	type BookmarkContextValue,
} from "./BookmarkContext";
import { consume } from "@lit/context";

@customElement("alb-bookmark-list")
export class BookmarkList extends LitElement {
	@consume({ context: bookmarkContext, subscribe: true })
	bookmarkContext: BookmarkContextValue = bookmarkContextDefault;

	override render() {
		return html`
			<ul>
				${this.bookmarkContext.bookmarks.map(
					(item) => html`
						<alb-bookmark-item .item=${item}></alb-bookmark-item>
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
