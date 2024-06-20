import { LitElement, html } from "lit";
import { customElement } from "lit/decorators/custom-element.js";
import { property } from "lit/decorators.js";
import type { InferSelectModel } from "drizzle-orm";
import type { bookmarkTable, tagTable } from "@server/db";
import type { mastodon } from "masto";
import "./BookmarkTagsForm";

@customElement("alb-bookmark-item")
export class BookmarkItem extends LitElement {
	@property({ attribute: false })
	bookmark: InferSelectModel<typeof bookmarkTable> | null = null;

	@property({ attribute: false })
	mastoBookmark: mastodon.v1.Status | null = null;

	@property({ attribute: false })
	tags: InferSelectModel<typeof tagTable>[] = [];

	@property({ attribute: false })
	allTags: InferSelectModel<typeof tagTable>[] = [];

	override render() {
		return html`
            <li>
				<alb-bookmark-tags-form .tags=${this.tags}>
				</alb-bookmark-tags-form>
                <pre>${JSON.stringify(
									{
										bookmark: this.bookmark,
										mastoBookmark: this.mastoBookmark,
									},
									null,
									2,
								)}</pre>
            </li>
        `;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"alb-bookmark-item": BookmarkItem;
	}
}
