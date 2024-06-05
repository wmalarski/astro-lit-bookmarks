import { LitElement, html } from "lit";
import { customElement } from "lit/decorators/custom-element.js";
import { query } from "lit/decorators/query.js";
import {
	CreateTagEvent,
	SubmitNewTagEvent,
	SubmitTagFailEvent,
} from "./events";
import { Task } from "@lit/task";
import { actions } from "astro:actions";

@customElement("alb-create-tag-form")
export class CreateTagForm extends LitElement {
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

	private createTagTask = new Task<
		[string],
		Awaited<ReturnType<typeof actions.createTag>>
	>(this, {
		autoRun: false,
		task: ([name]) => actions.createTag({ name }),
		onComplete: (result) => {
			this.dispatchEvent(
				result.success
					? new CreateTagEvent(result.tag)
					: new SubmitTagFailEvent(),
			);
		},
		onError: () => {
			this.dispatchEvent(new SubmitTagFailEvent());
		},
	});

	async onSubmit(event: Event) {
		event.preventDefault();

		const { value } = this.newTagInput;

		if (value.length > 0) {
			this.dispatchEvent(new SubmitNewTagEvent(value));
			await this.createTagTask.run([value]);
			this.newTagInput.value = "";
		}
	}
}

declare global {
	// eslint-disable-next-line no-unused-vars
	interface HTMLElementTagNameMap {
		"alb-create-tag-form": CreateTagForm;
	}
}
