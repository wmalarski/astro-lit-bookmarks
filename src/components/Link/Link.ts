import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import {
	buttonRecipe,
	buttonStyles,
	type ButtonProps,
} from "../Button/Button.styles";

@customElement("alb-anchor")
export class AlbAnchor extends LitElement {
	@property({ type: String, reflect: true })
	variant: ButtonProps["variant"] = "primary";

	@property({ type: String, reflect: true })
	size: ButtonProps["size"] = "medium";

	@property({ type: String, reflect: true })
	href: string | undefined;

	static override styles = [buttonStyles];

	override render() {
		return html`<button class=${buttonRecipe({
			size: this.size,
			variant: this.variant,
		})} href=${this.href}>
      <slot></slot>
    </button>`;
	}
}
