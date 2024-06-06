import { LitElement, html } from "lit";
import { customElement } from "lit/decorators/custom-element.js";
import { property } from "lit/decorators.js";
import type { mastodon } from "masto";

@customElement("alb-masto-bookmark-item")
export class MastoBookmarkItem extends LitElement {
	@property({ attribute: false })
	mastoBookmark: mastodon.v1.Status | null = null;

	override render() {
		return html`
            <li>
                <pre>${JSON.stringify(this.mastoBookmark, null, 2)}</pre>
            </li>
        `;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"alb-masto-bookmark-item": MastoBookmarkItem;
	}
}
