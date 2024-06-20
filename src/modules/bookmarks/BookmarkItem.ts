import { LitElement, html } from "lit";
import { customElement } from "lit/decorators/custom-element.js";
import { property } from "lit/decorators.js";
import "./BookmarkTagsForm";
import type { MatchBookmarksResult } from "./matchBookmarks";

@customElement(BookmarkItem.elementName)
export class BookmarkItem extends LitElement {
	static readonly elementName = "bookmark-item" as const;

	@property({ attribute: false })
	item: MatchBookmarksResult | null = null;

	override render() {
		return html`
            <li>
				<bookmark-tags-form .item=${this.item}></bookmark-tags-form>
                <pre>${JSON.stringify(this.item, null, 2)}</pre>
            </li>
        `;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		[BookmarkItem.elementName]: BookmarkItem;
	}
}
