import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import "./CreateTagForm";
import "./TagsListItem";
import {
	tagsContext,
	tagsContextDefault,
	type TagsContextValue,
} from "./TagsContext";
import { consume } from "@lit/context";

@customElement("tags-list")
export class TagsList extends LitElement {
	static readonly elementName = "tags-list" as const;

	@consume({ context: tagsContext, subscribe: true })
	tagsContext: TagsContextValue = tagsContextDefault;

	override render() {
		return html`
		<div>
			<create-tag-form></create-tag-form>
			<pre>${JSON.stringify(this.tagsContext.optimisticTag, null, 2)}</pre>
			<ul>
				${this.tagsContext.tags.map(
					(tag) => html`<tags-list-item .tag=${tag}></tags-list-item>`,
				)}
			</ul>
		</div>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		[TagsList.elementName]: TagsList;
	}
}
