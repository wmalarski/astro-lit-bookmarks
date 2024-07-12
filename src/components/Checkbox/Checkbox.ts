import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { checkboxRecipe, type CheckboxVariants } from "./Checkbox.styles";
import { tailwindStyles } from "@styles/tailwind";

@customElement(AlbCheckbox.elementName)
export class AlbCheckbox extends LitElement {
	static readonly elementName = "alb-checkbox" as const;

	@property({ type: String })
	color: CheckboxVariants["color"] = "primary";

	@property({ type: String })
	size: CheckboxVariants["size"] = "md";

	@property({ type: Boolean, reflect: true })
	checked = false;

	// @property({ type: Boolean, reflect: true })
	// checked = false;

	static override styles = [tailwindStyles];

	override render() {
		return html`
		<input 
            type="checkbox" 
            class=${checkboxRecipe({ size: this.size, color: this.color })}
            ?checked=${this.checked}
        />
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		[AlbCheckbox.elementName]: AlbCheckbox;
	}
}
