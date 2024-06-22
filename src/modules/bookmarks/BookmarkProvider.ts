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
		[string, string],
		Awaited<ReturnType<typeof actions.createBookmark>>
	>(this, {
		autoRun: false,
		task: ([mastoBookmarkId, tagId]) =>
			actions.createBookmark({ tagIds: [tagId], mastoBookmarkId }),
		onComplete: (result) => {
			this.value = {
				...this.value,
				isPending: false,
				bookmarks: this.value.bookmarks.map((entry) =>
					entry.mastoBookmark?.id === result.mastoBookmarkId
						? { ...entry, bookmark: result }
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
		[string, string],
		Awaited<ReturnType<typeof actions.createBookmarkTags>>
	>(this, {
		autoRun: false,
		task: ([bookmarkId, tagId]) =>
			actions.createBookmarkTags({ tagIds: [tagId], bookmarkId }),
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
		[string],
		Awaited<ReturnType<typeof actions.removeBookmarkTag>>
	>(this, {
		autoRun: false,
		task: ([bookmarkTagId]) => actions.removeBookmarkTag({ bookmarkTagId }),
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

		await this.createBookmarkTask.run([event.mastoBookmarkId, event.tagId]);
	}

	async onCreateBookmarkTag(event: CreateBookmarkTagEvent) {
		this.value = {
			...this.value,
			isPending: true,
			error: null,
		};

		await this.createBookmarkTagTask.run([event.bookmarkId, event.tagId]);
	}

	async onRemoveBookmarkTag(event: RemoveBookmarkTagEvent) {
		this.value = {
			...this.value,
			isPending: true,
			error: null,
		};

		await this.removeBookmarkTagTask.run([event.bookmarkTagId]);
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
