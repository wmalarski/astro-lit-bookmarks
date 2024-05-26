import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("alb-button")
export class AlbButton extends LitElement {
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

            &:hover {
              background-color: rgb(var(--purple-700));
            }
            &:active {
              background-color: rgb(var(--purple-800));
            }
            &:focus-visible {
              background-color: rgb(var(--purple-500));
              outline: 1px solid white;
            }
            &:disabled {
              background-color: rgba(var(--purple-500), 0.6);
            }
          }
        }
      }
    `,
  ];

  override render() {
    return html`<button class="primary">
      <slot></slot>
    </button>`;
  }
}
