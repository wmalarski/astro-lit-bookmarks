import { LitElement, html } from "lit";
import { customElement } from "lit/decorators/custom-element.js";
import { DeleteTagEvent } from "./events";
import { property } from "lit/decorators.js";
import type { InferSelectModel } from "drizzle-orm";
import type { tagTable } from "@server/db";
import "@components/Button/Button";
import {
  tagsContext,
  tagsContextDefault,
  type TagsContextValue,
} from "./TagsContext";
import { consume } from "@lit/context";

@customElement(TagsListItem.elementName)
export class TagsListItem extends LitElement {
  static readonly elementName = "tags-list-item" as const;

  @property({ attribute: false })
  tag?: InferSelectModel<typeof tagTable>;

  @consume({ context: tagsContext, subscribe: true })
  tagsContext: TagsContextValue = tagsContextDefault;

  override render() {
    return this.tagsContext.removingTagId === this.tag?.id
      ? null
      : html`
				<li>
					<span>${this.tag?.name}</span>
					<alb-button type="button" @click=${this.onDeleteClick}>
						Delete
					</alb-button>
				</li>
			`;
  }

  async onDeleteClick() {
    if (this.tag?.id) {
      this.dispatchEvent(new DeleteTagEvent(this.tag.id));
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [TagsListItem.elementName]: TagsListItem;
  }
}
