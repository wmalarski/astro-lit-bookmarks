import { LitElement, html } from "lit";
import { customElement } from "lit/decorators/custom-element.js";
import { property, query } from "lit/decorators.js";
import { consume } from "@lit/context";
import {
	tagsContext,
	tagsContextDefault,
	type TagsContextValue,
} from "@modules/tags/TagsContext";
import type { MatchBookmarksResult } from "./matchBookmarks";
import { CreateBookmarkEvent, CreateBookmarkTagEvent } from "./events";

@customElement(BookmarkTagsForm.elementName)
export class BookmarkTagsForm extends LitElement {
	static readonly elementName = "bookmark-tags-form" as const;

	@property({ attribute: false })
	item!: MatchBookmarksResult;

	@query("select", true)
	tagSelect!: HTMLSelectElement;

	@consume({ context: tagsContext, subscribe: true })
	tagsContext: TagsContextValue = tagsContextDefault;

	override render() {
		const tagsIds = new Set(
			this.item.bookmarkTags.map((bookmarkTag) => bookmarkTag.tagId),
		);
		const unassignedTags = this.tagsContext.tags.filter(
			(tag) => !tagsIds.has(tag.id),
		);

		return html`
			<form @change=${this.onChange}>
				<label>
					Tags
					<select name="tag">
						<option value="" selected>Please choose</option>
						${unassignedTags.map(
							(tag) => html`<option value=${tag.id}>${tag.name}</option>`,
						)}
					</select>
				</label>
			</form>
        `;
	}

	onChange() {
		const tagId = this.tagSelect.value;

		if (!tagId) {
			return;
		}

		if (this.item.bookmark?.id) {
			const event = new CreateBookmarkTagEvent(this.item.bookmark?.id, tagId);
			this.dispatchEvent(event);
		} else if (this.item.mastoBookmark?.id) {
			const event = new CreateBookmarkEvent(this.item.mastoBookmark.id, tagId);
			this.dispatchEvent(event);
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		[BookmarkTagsForm.elementName]: BookmarkTagsForm;
	}
}
