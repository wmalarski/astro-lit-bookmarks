import { LitElement, html } from "lit";
import { customElement } from "lit/decorators/custom-element.js";
import { query } from "lit/decorators/query.js";
import { AddTodoEvent } from "./events";

@customElement("alb-create-tag-form")
export class TodoForm extends LitElement {
	override render() {
		return html`<input 
            @change=${this.#onChange} 
            @keydown=${this.#onKeydown} 
            class="new-todo" 
            autofocus 
            autocomplete="off" 
            placeholder="What needs to be done?"
        />`;
	}

	@query("input", true) newTodoInput!: HTMLInputElement;

	#onChange() {
		const { value } = this.newTodoInput;
		if (value.length > 0) this.dispatchEvent(new AddTodoEvent(value));

		this.newTodoInput.value = "";
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
