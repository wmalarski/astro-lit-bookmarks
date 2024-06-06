import { LitElement, html } from "lit";
import { customElement } from "lit/decorators/custom-element.js";
import { property } from "lit/decorators.js";
import type { InferSelectModel } from "drizzle-orm";
import type { bookmarkTable } from "@server/db";

@customElement("alb-bookmark-item")
export class BookmarkItem extends LitElement {
	@property({ attribute: false })
	bookmark: InferSelectModel<typeof bookmarkTable> | null = null;

	override render() {
		return html`
            <li>
                <pre>${JSON.stringify(this.bookmark, null, 2)}</pre>
            </li>
        `;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"alb-bookmark-item": BookmarkItem;
	}
}
