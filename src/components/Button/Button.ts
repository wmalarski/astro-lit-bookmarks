import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { buttonRecipe, type ButtonVariants } from "./Button.styles";
import { tailwindStyles } from "@styles/tailwind";

@customElement(AlbButton.elementName)
export class AlbButton extends LitElement {
	static readonly elementName = "alb-button" as const;

	@property({ type: String })
	color: ButtonVariants["color"] = "primary";

	@property({ type: Boolean })
	isLoading: ButtonVariants["isLoading"] = false;

	@property({ type: String })
	shape: ButtonVariants["shape"] = null;

	@property({ type: String })
	size: ButtonVariants["size"] = "md";

	@property({ type: String })
	variant: ButtonVariants["variant"] = null;

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

type ButtonProps = Partial<
	Pick<AlbButton, keyof ButtonVariants | "disabled" | "type">
>;

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type ButtonComponent = (props: ButtonProps) => any;

export const Button = AlbButton as unknown as ButtonComponent;
