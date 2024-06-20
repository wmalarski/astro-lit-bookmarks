import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { buttonRecipe, buttonStyles, type ButtonProps } from "./Button.styles";

@customElement(AlbButton.elementName)
export class AlbButton extends LitElement {
	static readonly elementName = "alb-button" as const;

	@property({ type: String, reflect: true })
	variant: ButtonProps["variant"] = "primary";

	@property({ type: String, reflect: true })
	size: ButtonProps["size"] = "medium";

	@property({ type: String })
	type: "button" | "submit" | "reset" = "button";

	@property({ type: Boolean, reflect: true })
	disabled = false;

	static override styles = [buttonStyles];

	override render() {
		return html`
		<button 
			class=${buttonRecipe({ size: this.size, variant: this.variant })} 
			type=${this.type} 
			?disabled=${this.disabled}>
	      <slot></slot>
    	</button>
		`;
	}
}
