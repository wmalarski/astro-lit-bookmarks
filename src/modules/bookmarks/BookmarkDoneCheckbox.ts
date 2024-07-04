import { LitElement, html } from "lit";
import { customElement } from "lit/decorators/custom-element.js";
import { property, query } from "lit/decorators.js";
import type { MatchBookmarksResult } from "../../server/matchBookmarks";
import { CheckDoneBookmarkEvent } from "./events";

@customElement(BookmarkDoneCheckbox.elementName)
export class BookmarkDoneCheckbox extends LitElement {
	static readonly elementName = "bookmark-done-checkbox" as const;

	@property({ attribute: false })
	item!: MatchBookmarksResult;

	@query("input", true)
	tagInput!: HTMLInputElement;

	override render() {
		return html`
			<form @change=${this.onChange}>
				<label>
                    <input name="done" type="checkbox" ?checked=${this.item.bookmark?.done} />
					Done
				</label>
			</form>
        `;
	}

	onChange() {
		this.dispatchEvent(
			new CheckDoneBookmarkEvent({
				done: this.tagInput.checked,
				bookmarkId: this.item.bookmark?.id,
				mastoBookmarkId: this.item.mastoBookmark?.id,
			}),
		);
	}
}

declare global {
	interface HTMLElementTagNameMap {
		[BookmarkDoneCheckbox.elementName]: BookmarkDoneCheckbox;
	}
}
