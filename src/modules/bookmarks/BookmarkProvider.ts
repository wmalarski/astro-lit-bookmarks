import { LitElement, html } from "lit";
import { consume, provide } from "@lit/context";
import { customElement, property } from "lit/decorators.js";
import { Task } from "@lit/task";
import { actions } from "astro:actions";
import {
	bookmarkContext,
	bookmarkContextDefault,
	type BookmarkContextValue,
} from "./BookmarkContext";
import {
	tagsContext,
	tagsContextDefault,
	type TagsContextValue,
} from "@modules/tags/TagsContext";
import type {
	CreateBookmarkEvent,
	CreateBookmarkTagEvent,
	RemoveBookmarkTagEvent,
} from "./events";

type BookmarkProviderProps = {
	value: BookmarkContextValue;
};

@customElement(BookmarkProvider.elementName)
export class BookmarkProvider extends LitElement {
	static readonly elementName = "bookmark-provider" as const;

	@provide({ context: bookmarkContext })
	@property({ attribute: false })
	value: BookmarkContextValue = bookmarkContextDefault;

	@consume({ context: tagsContext, subscribe: true })
	tagsContext: TagsContextValue = tagsContextDefault;

	private createBookmarkTask = new Task<
		Parameters<typeof actions.createBookmark>,
		Awaited<ReturnType<typeof actions.createBookmark>>
	>(this, {
		autoRun: false,
		task: ([args]) => actions.createBookmark(args),
		onComplete: (result) => {
			const mastoBookmarkId = result.bookmark.mastoBookmarkId;
			this.value = {
				...this.value,
				isPending: false,
				bookmarks: this.value.bookmarks.map((entry) =>
					entry.mastoBookmark?.id === mastoBookmarkId
						? { ...entry, ...result }
						: entry,
				),
				error: null,
			};
		},
		onError: () => {
			this.value = {
				...this.value,
				isPending: false,
				error: "Tag submission error",
			};
		},
	});

	private createBookmarkTagTask = new Task<
		Parameters<typeof actions.createBookmarkTags>,
		Awaited<ReturnType<typeof actions.createBookmarkTags>>
	>(this, {
		autoRun: false,
		task: ([args]) => actions.createBookmarkTags(args),
		onComplete: (result) => {
			const resultBookmarkTag = result[0];

			if (!resultBookmarkTag) {
				return;
			}

			this.value = {
				...this.value,
				isPending: false,
				error: null,
				bookmarks: this.value.bookmarks.map((entry) =>
					entry.bookmark?.id === resultBookmarkTag.bookmarkId
						? { ...entry, bookmarkTags: [...result, ...entry.bookmarkTags] }
						: entry,
				),
			};
		},
		onError: () => {
			this.value = {
				...this.value,
				isPending: false,
				error: "Tag submission error",
			};
		},
	});

	private removeBookmarkTagTask = new Task<
		Parameters<typeof actions.removeBookmarkTag>,
		Awaited<ReturnType<typeof actions.removeBookmarkTag>>
	>(this, {
		autoRun: false,
		task: ([args]) => actions.removeBookmarkTag(args),
		onComplete: (result) => {
			this.value = {
				...this.value,
				isPending: false,
				error: null,
				bookmarks: this.value.bookmarks.map((entry) =>
					entry.bookmark?.id === result.bookmarkId
						? {
								...entry,
								bookmarkTags: entry.bookmarkTags.filter(
									(entry) => entry.id !== result.id,
								),
							}
						: entry,
				),
			};
		},
		onError: () => {
			this.value = {
				...this.value,
				isPending: false,
				error: "Tag remove error",
			};
		},
	});

	override render() {
		return html`<slot
            @bookmark-create=${this.onCreateBookmark}
            @bookmark-tag-create=${this.onCreateBookmarkTag}
			@bookmark-tag-remove=${this.onRemoveBookmarkTag}
        ></slot>`;
	}

	async onCreateBookmark(event: CreateBookmarkEvent) {
		this.value = {
			...this.value,
			isPending: true,
			error: null,
		};

		await this.createBookmarkTask.run([
			{ mastoBookmarkId: event.mastoBookmarkId, tagIds: event.tagIds },
		]);
	}

	async onCreateBookmarkTag(event: CreateBookmarkTagEvent) {
		this.value = {
			...this.value,
			isPending: true,
			error: null,
		};

		await this.createBookmarkTagTask.run([
			{ bookmarkId: event.bookmarkId, tagIds: event.tagIds },
		]);
	}

	async onRemoveBookmarkTag(event: RemoveBookmarkTagEvent) {
		this.value = {
			...this.value,
			isPending: true,
			error: null,
		};

		await this.removeBookmarkTagTask.run([
			{ bookmarkTagId: event.bookmarkTagId },
		]);
	}
}

declare global {
	interface HTMLElementTagNameMap {
		[BookmarkProvider.elementName]: BookmarkProvider;
	}
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type BookmarkProviderComponent = (props: BookmarkProviderProps) => any;

export const TypedBookmarkProvider =
	BookmarkProvider as unknown as BookmarkProviderComponent;
