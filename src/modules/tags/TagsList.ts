import type { tagTable } from "@server/db";
import type { InferSelectModel } from "drizzle-orm";
import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import "./CreateTagForm";
import "./TagsListItem";
import type {
	CreateTagEvent,
	DeleteTagEvent,
	SubmitNewTagEvent,
} from "./events";

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
			<alb-create-tag-form 
				@tag-submit-new=${this.onSubmitNewTag}
				@tag-create=${this.onCreateTag}
				@tag-submit-fail=${this.onSubmitTagFail}
			></alb-create-tag-form>
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

	onSubmitNewTag(event: SubmitNewTagEvent) {
		this.optimisticTag = event.name;
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
	// eslint-disable-next-line no-unused-vars
	interface HTMLElementTagNameMap {
		"alb-tags-list": AlbTagsList;
	}
}

export const TypedAlbTagsList = AlbTagsList as unknown as AlbTagsListComponent;
