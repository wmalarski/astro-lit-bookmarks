import { LitElement, html } from "lit";
import { customElement } from "lit/decorators/custom-element.js";
import { query } from "lit/decorators/query.js";
import { SubmitNewTagEvent } from "./events";

@customElement(CreateTagForm.elementName)
export class CreateTagForm extends LitElement {
  static readonly elementName = "create-tag-form" as const;

  override render() {
    return html`
		<form @submit=${this.onSubmit}>
			<label>
				<span>New tag</span>
				<input autofocus autocomplete="off" />
			</label>
		</form>
	`;
  }

  @query("input", true) newTagInput!: HTMLInputElement;

  async onSubmit(event: Event) {
    event.preventDefault();

    const { value } = this.newTagInput;

    if (value.length > 0) {
      this.dispatchEvent(new SubmitNewTagEvent(value));
    }

    this.newTagInput.value = "";
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [CreateTagForm.elementName]: CreateTagForm;
  }
}
