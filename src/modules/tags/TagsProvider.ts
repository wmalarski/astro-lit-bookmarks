import { LitElement, html } from "lit";
import { provide } from "@lit/context";
import { customElement, state } from "lit/decorators.js";
import {
	tagsContext,
	tagsContextDefault,
	type TagsContextValue,
} from "./TagsContext";
import type { SubmitNewTagEvent } from "./events";
import { Task } from "@lit/task";
import { actions } from "astro:actions";

@customElement("alb-tags-provider")
export class TagsProvider extends LitElement {
	@provide({ context: tagsContext })
	@state()
	value: TagsContextValue = tagsContextDefault;

	private createTagTask = new Task<
		[string],
		Awaited<ReturnType<typeof actions.createTag>>
	>(this, {
		autoRun: false,
		task: ([name]) => actions.createTag({ name }),
		onComplete: (result) => {
			if (result.success) {
				this.value = {
					optimisticTag: null,
					isPending: false,
					tags: [result.tag, ...this.value.tags],
					error: null,
				};
				return;
			}
			this.value = {
				...this.value,
				optimisticTag: null,
				isPending: false,
				error: "Tag submission error",
			};
		},
		onError: () => {
			this.value = {
				...this.value,
				optimisticTag: null,
				isPending: false,
				error: "Tag submission error",
			};
		},
	});

	override render() {
		return html`<slot
            @tag-submit-new=${this.onSubmitNewTag}
        ></slot>`;
	}

	async onSubmitNewTag(event: SubmitNewTagEvent) {
		this.value = {
			...this.value,
			optimisticTag: event.name,
			isPending: true,
			error: null,
		};

		await this.createTagTask.run([event.name]);
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"alb-tags-provider": TagsProvider;
	}
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type TagsProviderComponent = () => any;

export const TypedTagsProvider =
	TagsProvider as unknown as TagsProviderComponent;
