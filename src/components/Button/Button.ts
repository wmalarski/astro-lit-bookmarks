import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("alb-button")
export class AlbButton extends LitElement {
	@property({ type: String, reflect: true })
	public variant: "primary" | "secondary" = "primary";

	@property({ type: String })
	public type: "button" | "submit" | "reset" = "button";

	@property({ type: Boolean, reflect: true })
	public disabled: boolean | undefined;

	static override styles = [
		css`
      :host {
        button {
          all: unset;
          box-sizing: border-box;

          padding: 0.75rem 1.5rem;
          border-radius: 1.5rem;
          line-height: 1.5rem;
          font-size: 1rem;

          &.primary {
            color: rgb(var(--white));
            background-color: rgb(var(--purple-500));
            transition: background-color 100ms ease-in-out;

            &:hover {
              background-color: rgb(var(--purple-700));
            }
            &:active {
              background-color: rgb(var(--purple-800));
            }
            &:focus-visible {
              outline: 1px solid rgb(var(--white));
            }
            &:disabled {
              background-color: rgba(var(--purple-500), var(--op-disabled));
            }
          }

          &.secondary {
            color: rgb(var(--neutral-900));
            background-color: rgb(var(--neutral-200));
            transition: background-color 100ms ease-in-out;

            &:hover {
              background-color: rgb(var(--neutral-300));
            }
            &:active {
              background-color: rgb(var(--neutral-400));
            }
            &:focus-visible {
              outline: 1px solid rgb(var(--black));
            }
            &:disabled {
              color: rgba(var(--neutral-900), var(--op-disabled));
              background-color: rgb(var(--neutral-100));
            }
          }
        }
      }
    `,
	];

	override render() {
		return html`<button class=${this.variant} type=${this.type}>
      <slot></slot>
    </button>`;
	}
}
