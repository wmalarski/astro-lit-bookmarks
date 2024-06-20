import { LitElement, html } from "lit";
import { customElement } from "lit/decorators/custom-element.js";
import { property } from "lit/decorators.js";
import "./BookmarkTagsForm";
import type { MatchBookmarksResult } from "./matchBookmarks";

@customElement("alb-bookmark-item")
export class BookmarkItem extends LitElement {
	@property({ attribute: false })
	item: MatchBookmarksResult | null = null;

	override render() {
		return html`
            <li>
				<alb-bookmark-tags-form .item=${this.item}></alb-bookmark-tags-form>
                <pre>${JSON.stringify(this.item, null, 2)}</pre>
            </li>
        `;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"alb-bookmark-item": BookmarkItem;
	}
}
