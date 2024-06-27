import { LitElement, html } from "lit";
import { provide } from "@lit/context";
import { customElement, property } from "lit/decorators.js";

import { mastoContext, type MastoContextValue } from "./MastoContext";
import { createRestAPIClient } from "masto";

type MastoProviderProps = {
	url: string;
	accessToken: string;
};

@customElement(MastoProvider.elementName)
export class MastoProvider extends LitElement {
	static readonly elementName = "masto-provider" as const;

	@provide({ context: mastoContext })
	@property({ attribute: false })
	value!: MastoContextValue;

	@property({ attribute: false })
	url!: string;

	@property({ attribute: false })
	accessToken!: string;

	constructor() {
		super();

		this.value = {
			mastoClient: createRestAPIClient({
				url: this.url,
				accessToken: this.accessToken,
			}),
		};
	}

	override render() {
		return html`<slot></slot>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		[MastoProvider.elementName]: MastoProvider;
	}
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type MastoProviderComponent = (props: MastoProviderProps) => any;

export const TypedMastoProvider =
	MastoProvider as unknown as MastoProviderComponent;
