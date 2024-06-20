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
import {
	bookmarkContext,
	bookmarkContextDefault,
	type BookmarkContextValue,
} from "./BookmarkContext";

@customElement(BookmarkTagsForm.elementName)
export class BookmarkTagsForm extends LitElement {
	static readonly elementName = "bookmark-tags-form" as const;

	@property({ attribute: false })
	item: MatchBookmarksResult | null = null;

	@query("select", true)
	tagSelect!: HTMLSelectElement;

	@consume({ context: tagsContext, subscribe: true })
	tagsContext: TagsContextValue = tagsContextDefault;

	@consume({ context: bookmarkContext, subscribe: true })
	bookmarkContext: BookmarkContextValue = bookmarkContextDefault;

	override render() {
		const tagsIds = new Set(
			this.item?.bookmarkTags.map((bookmarkTag) => bookmarkTag.tagId),
		);

		const assignedTags = this.tagsContext.tags.filter((tag) =>
			tagsIds.has(tag.id),
		);

		const unassignedTags = this.tagsContext.tags.filter(
			(tag) => !tagsIds.has(tag.id),
		);

		return html`
            <form @change=${this.onChange}>
				${this.bookmarkContext.isPending ? html`<span>Loading</span>` : null}
				<ul>
					${assignedTags.map((tag) => html`<li><span>${tag.name}</span></li>`)}
				</ul>
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

	async onChange() {
		const tagId = this.tagSelect.value;

		console.log(
			"onChange",
			tagId,
			this.item?.bookmark?.id,
			this.item?.mastoBookmark?.id,
		);

		if (!tagId) {
			return;
		}

		if (this.item?.bookmark?.id) {
			const event = new CreateBookmarkTagEvent(this.item?.bookmark?.id, tagId);
			this.dispatchEvent(event);
		} else if (this.item?.mastoBookmark?.id) {
			const event = new CreateBookmarkEvent(this.item?.mastoBookmark.id, tagId);
			this.dispatchEvent(event);
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		[BookmarkTagsForm.elementName]: BookmarkTagsForm;
	}
}
