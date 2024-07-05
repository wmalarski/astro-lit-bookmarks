import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { buttonRecipe, type ButtonProps } from "./Button.styles";
import { tailwindStyles } from "@styles/tailwind";

@customElement(AlbButton.elementName)
export class AlbButton extends LitElement {
	static readonly elementName = "alb-button" as const;

	@property({ type: String, reflect: true })
	color: ButtonProps["color"] = "primary";

	@property({ type: Boolean, reflect: true })
	isLoading: ButtonProps["isLoading"] = false;

	@property({ type: String, reflect: true })
	shape: ButtonProps["shape"] = null;

	@property({ type: String, reflect: true })
	size: ButtonProps["size"] = "md";

	@property({ type: String, reflect: true })
	variant: ButtonProps["variant"] = null;

	@property({ type: String })
	type: "button" | "submit" | "reset" = "button";

	@property({ type: Boolean, reflect: true })
	disabled = false;

	static override styles = [tailwindStyles];

	override render() {
		return html`
		<button 
			class=${buttonRecipe({
				size: this.size,
				variant: this.variant,
				color: this.color,
				isLoading: this.isLoading,
				shape: this.shape,
			})} 
			type=${this.type} 
			?disabled=${this.disabled}>
	      <slot></slot>
    	</button>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		[AlbButton.elementName]: AlbButton;
	}
}

type AlbButtonProps = ButtonProps & {
	disabled?: boolean;
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type AlbButtonComponent = (props: AlbButtonProps) => any;

export const TypedAlbButton = AlbButton as unknown as AlbButtonComponent;
