import type { tagTable } from "@server/db";
import type { InferSelectModel } from "drizzle-orm";
import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import "./CreateTagForm";
import type { CreateTagEvent } from "./events";
import { Task } from "@lit/task";
import { actions } from "astro:actions";

type AlbTagsListProps = {
	tags: InferSelectModel<typeof tagTable>[];
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type AlbTagsListComponent = (props: AlbTagsListProps) => any;

@customElement("alb-tags-list")
export class AlbTagsList extends LitElement {
	@property({ attribute: false })
	optimisticTag: string | null = null;

	@property({ attribute: false })
	tags: InferSelectModel<typeof tagTable>[] = [];

	override render() {
		return html`
		<div>
			<alb-create-tag-form @tag-create=${this.onCreateTag}></alb-create-tag-form>
			<pre>${JSON.stringify(this.optimisticTag, null, 2)}</pre>
			<pre>${JSON.stringify(this.tags, null, 2)}</pre>
		</div>`;
	}

	private createTagTask = new Task<
		[string],
		Awaited<ReturnType<typeof actions.createTag>>
	>(this, {
		autoRun: false,
		task: ([name]) => actions.createTag({ name }),
		onComplete: (result) => {
			if (result.success) {
				this.optimisticTag = null;
				this.tags = [result.tag, ...this.tags];
			}
		},
		onError: () => {
			this.optimisticTag = null;
		},
	});

	onCreateTag = async (event: CreateTagEvent) => {
		this.optimisticTag = event.text;
		await this.createTagTask.run([event.text]);
	};
}

declare global {
	// eslint-disable-next-line no-unused-vars
	interface HTMLElementTagNameMap {
		"alb-tags-list": AlbTagsList;
	}
}

export const TypedAlbTagsList = AlbTagsList as unknown as AlbTagsListComponent;
