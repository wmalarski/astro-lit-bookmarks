import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators/custom-element.js";
import { property } from "lit/decorators.js";
import "./BookmarkTagsForm";
import "./BookmarkTag";
import "./BookmarkDoneCheckbox";
import "@components/Button/Button";
import "@components/Anchor/Anchor";
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

	override render() {
		return html`
			<alb-anchor href=${this.card.url}>
				<img class="card" src=${this.card.image} alt=${this.card.title} />
			</alb-anchor>
        `;
	}
}

@customElement(MastoBookmarkItem.elementName)
export class MastoBookmarkItem extends LitElement {
	static readonly elementName = "masto-bookmark-item" as const;

	@property({ attribute: false })
	mastoBookmark!: Status;

	static override styles = tailwindStyles;

	override render() {
		return html`
            <div class="flex flex-col gap-2">
				<span>${this.mastoBookmark.created_at}</span>
				<span>${this.mastoBookmark.uri}</span>
				<div>
					<span>${this.mastoBookmark.account.display_name}</span>
					<img class="avatar w-8 h-8" src=${this.mastoBookmark.account.avatar_static} />
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
			<alb-button @click=${this.onRemoveClick}>Remove</alb-button>
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

	static override styles = tailwindStyles;

	override render() {
		const { text, title } = this.getCardDetails();

		const assignedTags = this.item.bookmarkTags.flatMap((bookmarkTag) => {
			const tag = this.tagsContext.tagsMap.get(bookmarkTag.tagId);
			return tag ? [{ tag, bookmarkTag }] : [];
		});

		return html`
			<div class="flex flex-col gap-2">
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
				<alb-button type="button" @click=${this.onShareClick}>Share</alb-button>
				${
					this.item.mastoBookmark
						? html`<masto-bookmark-item .mastoBookmark=${this.item.mastoBookmark}></masto-bookmark-item>`
						: null
				}
			</div>
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
