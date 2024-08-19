import { LitElement, html } from "lit";
import { customElement } from "lit/decorators/custom-element.js";
import { property, query } from "lit/decorators.js";
import { consume } from "@lit/context";
import {
  tagsContext,
  tagsContextDefault,
  type TagsContextValue,
} from "@modules/tags/TagsContext";
import type { MatchBookmarksResult } from "../../server/matchBookmarks";
import { CreateBookmarkTagEvent } from "./events";

@customElement(BookmarkTagsForm.elementName)
export class BookmarkTagsForm extends LitElement {
  static readonly elementName = "bookmark-tags-form" as const;

  @property({ attribute: false })
  item!: MatchBookmarksResult;

  @query("select", true)
  tagSelect!: HTMLSelectElement;

  @consume({ context: tagsContext, subscribe: true })
  tagsContext: TagsContextValue = tagsContextDefault;

  override render() {
    const tagsIds = new Set(
      this.item.bookmarkTags.map((bookmarkTag) => bookmarkTag.tagId),
    );
    const unassignedTags = this.tagsContext.tags.filter(
      (tag) => !tagsIds.has(tag.id),
    );

    return html`
			<form @change=${this.onChange}>
				<label>
					Tags
					<select name="tag">
						<option value="" selected>Please choose</option>
						${unassignedTags.map(
              (tag) => html`<option value=${tag.id}>${tag.name}</option>`,
            )}
					</select>
				</label>
			</form>
        `;
  }

  onChange() {
    const tagId = this.tagSelect.value;

    if (!tagId) {
      return;
    }

    this.dispatchEvent(
      new CreateBookmarkTagEvent({
        bookmarkId: this.item.bookmark?.id,
        tagIds: [tagId],
        mastoBookmarkId: this.item.mastoBookmark?.id,
      }),
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [BookmarkTagsForm.elementName]: BookmarkTagsForm;
  }
}
