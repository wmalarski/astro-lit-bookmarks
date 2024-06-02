import type { tagTable } from "@server/db";
import type { InferSelectModel } from "drizzle-orm";
import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import "./CreateTagForm";

type AlbTagsListProps = {
	tags: InferSelectModel<typeof tagTable>[];
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type AlbTagsListComponent = (props: AlbTagsListProps) => any;

@customElement("alb-tags-list")
export class AlbTagsList extends LitElement {
	@property({ attribute: false })
	tags: InferSelectModel<typeof tagTable>[] = [];

	override render() {
		return html`<div>
			<alb-create-tag-form></alb-create-tag-form>
			<pre>${JSON.stringify(this.tags, null, 2)}</pre>
	</div>`;
	}
}

export const TypedAlbTagsList = AlbTagsList as unknown as AlbTagsListComponent;
