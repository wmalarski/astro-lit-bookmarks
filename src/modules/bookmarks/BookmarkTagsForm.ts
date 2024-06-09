import { LitElement, html } from "lit";
import { customElement } from "lit/decorators/custom-element.js";
import { property, query } from "lit/decorators.js";
import type { InferSelectModel } from "drizzle-orm";
import type { tagTable } from "@server/db";

@customElement("alb-bookmark-tags-form")
export class BookmarkTagsForm extends LitElement {
	@property({ attribute: false })
	tags: InferSelectModel<typeof tagTable>[] = [];

	@property({ attribute: false })
	allTags: InferSelectModel<typeof tagTable>[] = [];

	@query("select", true)
	tagSelect!: HTMLSelectElement;

	override render() {
		const tagsIds = new Set(this.tags.map((tag) => tag.id));

		return html`
            <form @change=${this.onChange}>
				<ul>
				${this.tags.map(
					(tag) => html`<li>
						<span>${tag.name}</span>
					</li>`,
				)}
				</ul>
				<label>
					Tags
					<select name="tag">
						<option value="" selected>Please choose</option>
						${this.allTags
							.filter((tag) => !tagsIds.has(tag.id))
							.map((tag) => html`<option value=${tag.id}>${tag.name}</option>`)}
					</select>
				</label>
            </form>
        `;
	}

	async onChange(event: Event) {
		const value = this.tagSelect.value;
		console.log("event", value);
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"alb-bookmark-tags-form": BookmarkTagsForm;
	}
}
