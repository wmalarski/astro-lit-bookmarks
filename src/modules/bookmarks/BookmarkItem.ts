import { LitElement, html } from "lit";
import { customElement } from "lit/decorators/custom-element.js";
import { property } from "lit/decorators.js";
import "./BookmarkTagsForm";
import "./BookmarkTag";
import type { MatchBookmarksResult } from "./matchBookmarks";
import { consume } from "@lit/context";
import {
	tagsContext,
	tagsContextDefault,
	type TagsContextValue,
} from "@modules/tags/TagsContext";

@customElement(BookmarkItem.elementName)
export class BookmarkItem extends LitElement {
	static readonly elementName = "bookmark-item" as const;

	@property({ attribute: false })
	item!: MatchBookmarksResult;

	@consume({ context: tagsContext, subscribe: true })
	tagsContext: TagsContextValue = tagsContextDefault;

	override render() {
		const assignedTags = this.item.bookmarkTags.flatMap((bookmarkTag) => {
			const tag = this.tagsContext.tagsMap.get(bookmarkTag.tagId);
			return tag ? [{ tag, bookmarkTag }] : [];
		});

		return html`
            <li>
				<ul>
					${assignedTags?.map(
						({ tag, bookmarkTag }) => html`
						<bookmark-tag .tag=${tag} .bookmarkTag=${bookmarkTag}></bookmark-tag>
					`,
					)}
				</ul>
				<bookmark-tags-form .item=${this.item}></bookmark-tags-form>
				<pre>${JSON.stringify(assignedTags, null, 2)}</pre>
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
