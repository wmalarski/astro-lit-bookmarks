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
import {
	CreateBookmarkEvent,
	CreateBookmarkTagEvent,
	RemoveBookmarkTagEvent,
} from "./events";
import {
	bookmarkContext,
	bookmarkContextDefault,
	type BookmarkContextValue,
} from "./BookmarkContext";
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

@customElement(BookmarkTagsForm.elementName)
export class BookmarkTagsForm extends LitElement {
	static readonly elementName = "bookmark-tags-form" as const;

	@property({ attribute: false })
	item!: MatchBookmarksResult;

	@query("select", true)
	tagSelect!: HTMLSelectElement;

	@consume({ context: tagsContext, subscribe: true })
	tagsContext: TagsContextValue = tagsContextDefault;

	@consume({ context: bookmarkContext, subscribe: true })
	bookmarkContext: BookmarkContextValue = bookmarkContextDefault;

	override render() {
		const assignedTags = this.item.bookmarkTags.flatMap((bookmarkTag) => {
			const tag = this.tagsContext.tagsMap.get(bookmarkTag.tagId);
			return tag ? [{ tag, bookmarkTag }] : [];
		});

		const tagsIds = new Set(
			this.item.bookmarkTags.map((bookmarkTag) => bookmarkTag.tagId),
		);
		const unassignedTags = this.tagsContext.tags.filter(
			(tag) => !tagsIds.has(tag.id),
		);

		return html`
			<div>
				${this.bookmarkContext.isPending ? html`<span>Loading</span>` : null}
				<ul>
					${assignedTags?.map(
						({ tag, bookmarkTag }) => html`
						<bookmark-tag .tag=${tag} .bookmarkTag=${bookmarkTag}></bookmark-tag>
					`,
					)}
				</ul>
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
			</div>
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
		[BookmarkTag.elementName]: BookmarkTag;
	}
}
