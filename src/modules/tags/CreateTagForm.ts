import { LitElement, html } from "lit";
import { customElement } from "lit/decorators/custom-element.js";
import { query } from "lit/decorators/query.js";
import { AddTodoEvent } from "./events";

@customElement("alb-create-tag-form")
export class TodoForm extends LitElement {
	onSubmit(event: Event) {
		console.log("onSubmit");
		event.preventDefault();

		const { value } = this.newTagInput;
		console.log({ value });
	}
	override render() {
		return html`<form @submit=${this.onSubmit}>
			<input
            class="new-todo" 
            autofocus 
            autocomplete="off" 
            placeholder="What needs to be done?"
        />
	</form>`;
	}

	@query("input", true) newTagInput!: HTMLInputElement;

	#onChange() {
		const { value } = this.newTagInput;
		if (value.length > 0) this.dispatchEvent(new AddTodoEvent(value));

		this.newTagInput.value = "";
	}

	#onKeydown(e: KeyboardEvent) {
		if (e.key === "Enter") this.#onChange();
	}
}

// declare global {
// 	// eslint-disable-next-line no-unused-vars
// 	interface HTMLElementTagNameMap {
// 		"todo-form": TodoForm;
// 	}
// }
