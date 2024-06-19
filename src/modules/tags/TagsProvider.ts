import { LitElement, html } from "lit";
import { provide } from "@lit/context";
import { customElement, state } from "lit/decorators.js";
import { tagsContext, type TagsContextValue } from "./TagsContext";

@customElement("alb-tags-provider")
export class TagsProvider extends LitElement {
	@provide({ context: tagsContext })
	@state()
	logger: TagsContextValue = { optimisticTag: "hello", tags: [] };

	override render() {
		return html`<div><slot></slot></div>`;
	}
}

@customElement("alb-tags-provider-wrapper")
export class TagsProviderWrapper extends LitElement {
	override render() {
		return html`
            <alb-tags-provider>
                <slot></slot>
            </alb-tags-provider>
        `;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"alb-tags-provider": TagsProvider;
		"alb-tags-provider-wrapper": TagsProviderWrapper;
	}
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type TagsProviderComponent = () => any;

export const TypedTagsProvider =
	TagsProvider as unknown as TagsProviderComponent;
