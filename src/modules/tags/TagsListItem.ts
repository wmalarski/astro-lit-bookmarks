import { LitElement, html } from "lit";
import { customElement } from "lit/decorators/custom-element.js";
import { DeleteTagEvent } from "./events";
import { property } from "lit/decorators.js";
import type { InferSelectModel } from "drizzle-orm";
import type { tagTable } from "@server/db";
import "@components/Button/Button";

@customElement("alb-tags-list-item")
export class TagsListItem extends LitElement {
	@property({ attribute: false })
	tag?: InferSelectModel<typeof tagTable>;

	override render() {
		return html`
            <li>
                <span>${this.tag?.name}</span>
                <alb-button type="button" @click=${this.onDeleteClick}>
                    Delete
                </alb-button>
            </li>
        `;
	}

	onDeleteClick() {
		const tagId = this.tag?.id;
		if (tagId) {
			this.dispatchEvent(new DeleteTagEvent(tagId));
		}
	}
}

declare global {
	// eslint-disable-next-line no-unused-vars
	interface HTMLElementTagNameMap {
		"alb-tags-list-item": TagsListItem;
	}
}
