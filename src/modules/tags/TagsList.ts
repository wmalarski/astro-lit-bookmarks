import type { tagTable } from "@server/db";
import type { InferSelectModel } from "drizzle-orm";
import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import "./CreateTagForm";
import "./TagsListItem";
import type {
	CreateTagEvent,
	DeleteTagEvent,
	SubmitNewTagEvent,
} from "./events";
import {
	tagsContext,
	tagsContextDefault,
	type TagsContextValue,
} from "./TagsContext";
import { consume } from "@lit/context";

type TagsListProps = {
	tags: InferSelectModel<typeof tagTable>[];
};

@customElement("alb-tags-list")
export class TagsList extends LitElement {
	@state()
	optimisticTag: string | null = null;

	@property({ attribute: false })
	tags: InferSelectModel<typeof tagTable>[] = [];

	@consume({ context: tagsContext, subscribe: true })
	contextTags: TagsContextValue = tagsContextDefault;

	override render() {
		return html`
		<div>
			<alb-create-tag-form 
				@tag-create=${this.onCreateTag}
				@tag-submit-fail=${this.onSubmitTagFail}
			></alb-create-tag-form>
			<pre>${JSON.stringify(this.contextTags.optimisticTag, null, 2)}</pre>
			<pre>${JSON.stringify(this.optimisticTag, null, 2)}</pre>
			<ul>
				${this.tags.map(
					(tag) => html`
					<alb-tags-list-item 
						.tag=${tag}
						@tag-delete=${this.onDeleteTag}
					></alb-tags-list-item>
					`,
				)}
			</ul>
		</div>`;
	}

	onCreateTag(event: CreateTagEvent) {
		this.tags = [event.tag, ...this.tags];
		this.optimisticTag = null;
	}

	onSubmitTagFail() {
		this.optimisticTag = null;
	}

	onDeleteTag = async (event: DeleteTagEvent) => {
		this.tags = this.tags.filter((tag) => tag.id !== event.tagId);
	};
}

declare global {
	interface HTMLElementTagNameMap {
		"alb-tags-list": TagsList;
	}
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type TagsListComponent = (props: TagsListProps) => any;

export const TypedTagsList = TagsList as unknown as TagsListComponent;
