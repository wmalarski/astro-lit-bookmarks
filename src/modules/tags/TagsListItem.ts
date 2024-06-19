import { LitElement, html } from "lit";
import { customElement } from "lit/decorators/custom-element.js";
import { DeleteTagEvent } from "./events";
import { property, state } from "lit/decorators.js";
import type { InferSelectModel } from "drizzle-orm";
import type { tagTable } from "@server/db";
import "@components/Button/Button";
import { Task } from "@lit/task";
import { actions } from "astro:actions";
import {
	tagsContext,
	tagsContextDefault,
	type TagsContextValue,
} from "./TagsContext";
import { consume } from "@lit/context";

@customElement("alb-tags-list-item")
export class TagsListItem extends LitElement {
	@property({ attribute: false })
	tag?: InferSelectModel<typeof tagTable>;

	@state()
	private isRemoving = false;

	@consume({ context: tagsContext, subscribe: true })
	tagsContext: TagsContextValue = tagsContextDefault;

	override render() {
		return this.isRemoving
			? null
			: html`
				<li>
					<span>${this.tag?.name}</span>
					<alb-button type="button" @click=${this.onDeleteClick}>
						Delete
					</alb-button>
				</li>
			`;
	}

	private deleteTagTask = new Task<
		[string],
		Awaited<ReturnType<typeof actions.deleteTag>>
	>(this, {
		autoRun: false,
		task: ([tagId]) => actions.deleteTag({ tagId }),
		onComplete: (result) => {
			if (result.success) {
				this.isRemoving = false;
				this.dispatchEvent(new DeleteTagEvent(result.tag.id));
			}
		},
		onError: () => {
			this.isRemoving = false;
		},
	});

	async onDeleteClick() {
		if (this.tag?.id) {
			this.dispatchEvent(new DeleteTagEvent(this.tag.id));
			this.isRemoving = true;
			// await this.deleteTagTask.run([this.tag.id]);
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"alb-tags-list-item": TagsListItem;
	}
}
