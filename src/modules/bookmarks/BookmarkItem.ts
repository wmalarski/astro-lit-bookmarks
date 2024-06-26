import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators/custom-element.js";
import { property } from "lit/decorators.js";
import "./BookmarkTagsForm";
import "./BookmarkTag";
import "./BookmarkDoneCheckbox";
import type { MatchBookmarksResult } from "../../server/matchBookmarks";
import { consume } from "@lit/context";
import {
	tagsContext,
	tagsContextDefault,
	type TagsContextValue,
} from "@modules/tags/TagsContext";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import type { PreviewCard, Status } from "@type/mastodon";

@customElement(MastoBookmarkCard.elementName)
export class MastoBookmarkCard extends LitElement {
	static readonly elementName = "masto-bookmark-card" as const;

	@property({ attribute: false })
	card!: PreviewCard;

	static override styles = css`
		img {
			width: 100%;
		}
	`;

	override render() {
		return html`
			<a href=${this.card.url}>
				<img class="card" src=${this.card.image} alt=${this.card.title} />
			</a>
        `;
	}
}

@customElement(MastoBookmarkItem.elementName)
export class MastoBookmarkItem extends LitElement {
	static readonly elementName = "masto-bookmark-item" as const;

	@property({ attribute: false })
	mastoBookmark!: Status;

	static override styles = css`
		.avatar {
			--size: 3rem;
			width: var(--size);
			height: var(--size);
		}

		.container {
			display: flex;
			flex-direction: column;
			gap: 0.5rem;
		}
	`;

	override render() {
		return html`
            <div class="container">
				<span>${this.mastoBookmark.created_at}</span>
				<span>${this.mastoBookmark.uri}</span>
				<div>
					<span>${this.mastoBookmark.account.display_name}</span>
					<img class="avatar" src=${this.mastoBookmark.account.avatar_static} />
				</div>
				<div>${unsafeHTML(this.mastoBookmark.content)}</div>
				<button type="button" @click=${this.onShareClick}>Share</button>
				${this.mastoBookmark.card?.image && html`<masto-bookmark-card .card=${this.mastoBookmark.card}></masto-bookmark-card>`}
            </div>
        `;
	}

	onShareClick() {
		navigator.share({
			url: this.mastoBookmark.uri,
			title: this.mastoBookmark.card?.title ?? "",
			text: this.mastoBookmark.card?.description ?? "",
		});
	}
}

@customElement(BookmarkItem.elementName)
export class BookmarkItem extends LitElement {
	static readonly elementName = "bookmark-item" as const;

	@property({ attribute: false })
	item!: MatchBookmarksResult;

	@consume({ context: tagsContext, subscribe: true })
	tagsContext: TagsContextValue = tagsContextDefault;

	static override styles = css`
		li { 
			display: flex;
			flex-direction: column;
			gap: 0.25rem;
			border-bottom: var(--border);
			padding: 1rem;
		}
  `;

	override render() {
		const assignedTags = this.item.bookmarkTags.flatMap((bookmarkTag) => {
			const tag = this.tagsContext.tagsMap.get(bookmarkTag.tagId);
			return tag ? [{ tag, bookmarkTag }] : [];
		});

		return html`
            <li>
				<strong>${this.item.mastoBookmark?.card?.title}</strong>
				<span>${this.item.mastoBookmark?.card?.description}</span>
				<ul>
					${assignedTags?.map(
						({ tag, bookmarkTag }) => html`
						<bookmark-tag .tag=${tag} .bookmarkTag=${bookmarkTag}></bookmark-tag>
					`,
					)}
				</ul>
				<bookmark-done-checkbox .item=${this.item}></bookmark-done-checkbox>
				<bookmark-tags-form .item=${this.item}></bookmark-tags-form>
				${
					this.item.mastoBookmark
						? html`<masto-bookmark-item .mastoBookmark=${this.item.mastoBookmark}></masto-bookmark-item>`
						: null
				}
            </li>
        `;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		[BookmarkItem.elementName]: BookmarkItem;
		[MastoBookmarkItem.elementName]: MastoBookmarkItem;
		[MastoBookmarkCard.elementName]: MastoBookmarkCard;
	}
}
