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

@customElement("alb-tags-list")
export class TagsList extends LitElement {
	@consume({ context: tagsContext, subscribe: true })
	tagsContext: TagsContextValue = tagsContextDefault;

	override render() {
		return html`
		<div>
			<alb-create-tag-form></alb-create-tag-form>
			<pre>${JSON.stringify(this.tagsContext.optimisticTag, null, 2)}</pre>
			<ul>
				${this.tagsContext.tags.map(
					(tag) => html`
					<alb-tags-list-item .tag=${tag}></alb-tags-list-item>
					`,
				)}
			</ul>
		</div>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"alb-tags-list": TagsList;
	}
}
