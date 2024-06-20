import { LitElement, html } from "lit";
import { provide } from "@lit/context";
import { customElement, property } from "lit/decorators.js";
import {
	tagsContext,
	tagsContextDefault,
	type TagsContextValue,
} from "./TagsContext";
import type { DeleteTagEvent, SubmitNewTagEvent } from "./events";
import { Task } from "@lit/task";
import { actions } from "astro:actions";

type TagsListProps = {
	value: TagsContextValue;
};

@customElement("alb-tags-provider")
export class TagsProvider extends LitElement {
	@provide({ context: tagsContext })
	@property({ attribute: false })
	value: TagsContextValue = tagsContextDefault;

	private createTagTask = new Task<
		[string],
		Awaited<ReturnType<typeof actions.createTag>>
	>(this, {
		autoRun: false,
		task: ([name]) => actions.createTag({ name }),
		onComplete: (result) => {
			this.value = {
				...this.value,
				optimisticTag: null,
				tags: [result, ...this.value.tags],
				error: null,
			};
		},
		onError: () => {
			this.value = {
				...this.value,
				optimisticTag: null,
				error: "Tag submission error",
			};
		},
	});

	private deleteTagTask = new Task<
		[string],
		Awaited<ReturnType<typeof actions.deleteTag>>
	>(this, {
		autoRun: false,
		task: ([tagId]) => actions.deleteTag({ tagId }),
		onComplete: (result) => {
			this.value = {
				...this.value,
				tags: this.value.tags.filter((tag) => tag.id !== result.id),
				removingTagId: null,
			};
		},
		onError: () => {
			this.value = {
				...this.value,
				error: "Error removing tag",
				removingTagId: null,
			};
		},
	});

	override render() {
		return html`<slot
            @tag-submit-new=${this.onSubmitNewTag}
            @tag-delete=${this.onDeleteTag}
        ></slot>`;
	}

	async onSubmitNewTag(event: SubmitNewTagEvent) {
		this.value = {
			...this.value,
			optimisticTag: event.name,
			error: null,
		};

		await this.createTagTask.run([event.name]);
	}

	onDeleteTag = async (event: DeleteTagEvent) => {
		this.value = {
			...this.value,
			removingTagId: event.tagId,
			error: null,
		};

		await this.deleteTagTask.run([event.tagId]);
	};
}

declare global {
	interface HTMLElementTagNameMap {
		"alb-tags-provider": TagsProvider;
	}
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type TagsProviderComponent = (props: TagsListProps) => any;

export const TypedTagsProvider =
	TagsProvider as unknown as TagsProviderComponent;
