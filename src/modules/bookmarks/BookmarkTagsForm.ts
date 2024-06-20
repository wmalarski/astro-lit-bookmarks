import { LitElement, html } from "lit";
import { customElement } from "lit/decorators/custom-element.js";
import { property, query, state } from "lit/decorators.js";
import type { InferSelectModel } from "drizzle-orm";
import type { tagTable } from "@server/db";
import { Task } from "@lit/task";
import { actions } from "astro:actions";
import { consume } from "@lit/context";
import {
	tagsContext,
	tagsContextDefault,
	type TagsContextValue,
} from "@modules/tags/TagsContext";

@customElement("alb-bookmark-tags-form")
export class BookmarkTagsForm extends LitElement {
	@property({ attribute: false })
	tags: InferSelectModel<typeof tagTable>[] = [];

	@property({ attribute: false })
	bookmarkId: string | undefined = undefined;

	@property({ attribute: false })
	mastoBookmarkId: string | undefined = undefined;

	@query("select", true)
	tagSelect!: HTMLSelectElement;

	@state()
	optimisticTagId: string | null = null;

	@state()
	error = false;

	@consume({ context: tagsContext, subscribe: true })
	tagsContext: TagsContextValue = tagsContextDefault;

	override render() {
		const tagsIds = new Set(this.tags.map((tag) => tag.id));
		const optimisticTag =
			this.optimisticTagId &&
			this.tagsContext.tags.find((tag) => tag.id === this.optimisticTagId);

		return html`
            <form @change=${this.onChange}>
				<ul>
					${optimisticTag && html`<span>${optimisticTag.name}</span>`}
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
						${this.tagsContext.tags
							.filter((tag) => !tagsIds.has(tag.id))
							.map((tag) => html`<option value=${tag.id}>${tag.name}</option>`)}
					</select>
				</label>
            </form>
        `;
	}

	private createBookmarkTask = new Task<
		[string, string],
		Awaited<ReturnType<typeof actions.createBookmark>>
	>(this, {
		autoRun: false,
		task: ([id, tagId]) => {
			return actions.createBookmark({ tagIds: [tagId], mastoBookmarkId: id });
		},
		onError: () => {
			this.optimisticTagId = null;
			this.error = true;
		},
	});

	private createMastoBookmarkTask = new Task<
		[string, string],
		Awaited<ReturnType<typeof actions.createBookmark>>
	>(this, {
		autoRun: false,
		task: ([id, tagId]) => {
			return actions.createMastoBookmark({ tagIds: [tagId], bookmarkId: id });
		},
		onError: () => {
			this.optimisticTagId = null;
			this.error = true;
		},
	});

	async onChange() {
		const tagId = this.tagSelect.value;

		if (!tagId) {
			return;
		}

		this.error = false;
		this.optimisticTagId = tagId;

		if (this.bookmarkId) {
			await this.createMastoBookmarkTask.run([this.bookmarkId, tagId]);
		} else if (this.mastoBookmarkId) {
			await this.createBookmarkTask.run([this.mastoBookmarkId, tagId]);
		}

		this.optimisticTagId = null;

		const tag = this.tagsContext.tags.find((tag) => tag.id === tagId);

		if (!tag) {
			return;
		}

		this.tags = [tag, ...this.tags];
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"alb-bookmark-tags-form": BookmarkTagsForm;
	}
}
