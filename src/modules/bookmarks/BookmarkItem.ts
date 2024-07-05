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
import { RemoveBookmarkEvent } from "./events";
import { tailwindStyles } from "@styles/tailwind";

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

	static override styles = [
		tailwindStyles,
		css`
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
	`,
	];

	override render() {
		return html`
            <div class="flex flex-col gap-2">
				<span>${this.mastoBookmark.created_at}</span>
				<span>${this.mastoBookmark.uri}</span>
				<div>
					<span>${this.mastoBookmark.account.display_name}</span>
					<img class="avatar" src=${this.mastoBookmark.account.avatar_static} />
				</div>
				<div>${unsafeHTML(this.mastoBookmark.content)}</div>
				${this.mastoBookmark.card?.image && html`<masto-bookmark-card .card=${this.mastoBookmark.card}></masto-bookmark-card>`}
            </div>
        `;
	}
}

@customElement(RemoveBookmarkButton.elementName)
export class RemoveBookmarkButton extends LitElement {
	static readonly elementName = "remove-bookmark-button" as const;

	@property({ attribute: false })
	item!: MatchBookmarksResult;

	override render() {
		return html`
			<button @click=${this.onRemoveClick}>Remove</button>
        `;
	}

	onRemoveClick() {
		if (!this.item.bookmark) {
			return;
		}

		this.dispatchEvent(
			new RemoveBookmarkEvent({ bookmarkId: this.item.bookmark.id }),
		);
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
		const { text, title } = this.getCardDetails();

		const assignedTags = this.item.bookmarkTags.flatMap((bookmarkTag) => {
			const tag = this.tagsContext.tagsMap.get(bookmarkTag.tagId);
			return tag ? [{ tag, bookmarkTag }] : [];
		});

		return html`
            <li>
				<strong>${title}</strong>
				<span>${text}</span>
				${
					assignedTags && assignedTags.length > 0
						? html`
					<ul>
						${assignedTags.map(
							({ tag, bookmarkTag }) => html`
							<bookmark-tag .tag=${tag} .bookmarkTag=${bookmarkTag}></bookmark-tag>
						`,
						)}
					</ul>					
				`
						: null
				}
				<bookmark-done-checkbox .item=${this.item}></bookmark-done-checkbox>
				<bookmark-tags-form .item=${this.item}></bookmark-tags-form>
				${
					!this.item.mastoBookmark && this.item.bookmark
						? html`<remove-bookmark-button .item=${this.item}></remove-bookmark-button>`
						: null
				}
				<button type="button" @click=${this.onShareClick}>Share</button>
				${
					this.item.mastoBookmark
						? html`<masto-bookmark-item .mastoBookmark=${this.item.mastoBookmark}></masto-bookmark-item>`
						: null
				}
            </li>
        `;
	}

	getCardDetails() {
		const bookmark = this.item.bookmark;
		const mastoCard = this.item.mastoBookmark?.card;

		const title = bookmark?.title ?? mastoCard?.title ?? "";
		const text = bookmark?.content ?? mastoCard?.description ?? "";
		const url = bookmark?.url ?? this.item.mastoBookmark?.uri ?? "";

		return { title, text, url };
	}

	onShareClick() {
		navigator.share(this.getCardDetails());
	}
}

declare global {
	interface HTMLElementTagNameMap {
		[BookmarkItem.elementName]: BookmarkItem;
		[MastoBookmarkItem.elementName]: MastoBookmarkItem;
		[MastoBookmarkCard.elementName]: MastoBookmarkCard;
		[RemoveBookmarkButton.elementName]: RemoveBookmarkButton;
	}
}
