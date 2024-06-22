import { LitElement, html } from "lit";
import { customElement } from "lit/decorators/custom-element.js";
import { property } from "lit/decorators.js";
import { RemoveBookmarkTagEvent } from "./events";
import type { InferSelectModel } from "drizzle-orm";
import type { bookmarkTagTable, tagTable } from "@server/db";

@customElement(BookmarkTag.elementName)
export class BookmarkTag extends LitElement {
	static readonly elementName = "bookmark-tag" as const;

	@property({ attribute: false })
	tag!: InferSelectModel<typeof tagTable>;

	@property({ attribute: false })
	bookmarkTag!: InferSelectModel<typeof bookmarkTagTable>;

	override render() {
		return html`
			<li>
				<span>${this.tag.name}</span>
				<button type="button" @click=${this.onRemoveClick}>Remove</button>
			</li>
		`;
	}

	onRemoveClick() {
		this.dispatchEvent(new RemoveBookmarkTagEvent(this.bookmarkTag.id));
	}
}

declare global {
	interface HTMLElementTagNameMap {
		[BookmarkTag.elementName]: BookmarkTag;
	}
}
