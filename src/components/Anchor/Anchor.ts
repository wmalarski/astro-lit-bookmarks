import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { buttonRecipe, type ButtonVariants } from "../Button/Button.styles";
import { tailwindStyles } from "@styles/tailwind";

@customElement(AlbAnchor.elementName)
export class AlbAnchor extends LitElement {
  static readonly elementName = "alb-anchor" as const;

  @property({ type: String })
  color: ButtonVariants["color"] = "primary";

  @property({ type: Boolean })
  isLoading: ButtonVariants["isLoading"] = false;

  @property({ type: String })
  shape: ButtonVariants["shape"] = null;

  @property({ type: String })
  size: ButtonVariants["size"] = "md";

  @property({ type: String })
  variant: ButtonVariants["variant"] = "link";

  @property({ type: String, reflect: true })
  href: string | undefined;

  static override styles = [tailwindStyles];

  override render() {
    return html`<a class=${buttonRecipe({
      size: this.size,
      variant: this.variant,
      color: this.color,
      isLoading: this.isLoading,
      shape: this.shape,
    })} href=${this.href}>
      <slot></slot>
    </a>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [AlbAnchor.elementName]: AlbAnchor;
  }
}
