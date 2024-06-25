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
	CheckDoneBookmarkEvent,
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

	private createBookmarkTagTask = new Task<
		Parameters<typeof actions.createBookmarkTags>,
		Awaited<ReturnType<typeof actions.createBookmarkTags>>
	>(this, {
		autoRun: false,
		task: ([args]) => actions.createBookmarkTags(args),
		onComplete: (result) => {
			const resultBookmarkTag = result.bookmarkTags[0];

			if (!resultBookmarkTag) {
				return;
			}

			this.value = {
				...this.value,
				isPending: false,
				error: null,
				bookmarks: this.value.bookmarks.map((entry) =>
					entry.bookmark?.id === resultBookmarkTag.bookmarkId
						? {
								...entry,
								bookmarkTags: [...result.bookmarkTags, ...entry.bookmarkTags],
								bookmark: result.bookmark ?? entry.bookmark,
							}
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

	private updateBookmarkDoneTask = new Task<
		Parameters<typeof actions.updateBookmarkDone>,
		Awaited<ReturnType<typeof actions.updateBookmarkDone>>
	>(this, {
		autoRun: false,
		task: ([args]) => actions.updateBookmarkDone(args),
		onComplete: (result) => {
			this.value = {
				...this.value,
				isPending: false,
				error: null,
				bookmarks: this.value.bookmarks.map((entry) =>
					entry.bookmark?.id === result.id
						? { ...entry, bookmark: result }
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

	private findBookmarksTask = new Task<
		Parameters<typeof actions.findBookmarks>,
		Awaited<ReturnType<typeof actions.findBookmarks>>
	>(this, {
		autoRun: false,
		task: ([args]) => actions.findBookmarks(args),
		onComplete: (result) => {
			this.value = {
				...this.value,
				isPending: false,
				error: null,
				bookmarks: [...this.value.bookmarks, ...result],
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
            @bookmark-tag-create=${this.onCreateBookmarkTag}
			@bookmark-tag-remove=${this.onRemoveBookmarkTag}
			@bookmark-check-done=${this.onCheckDoneBookmark}
			@bookmarks-load-more=${this.onLoadMoreBookmarks}
        ></slot>`;
	}

	startPending() {
		this.value = {
			...this.value,
			isPending: true,
			error: null,
		};
	}

	async onCreateBookmarkTag(event: CreateBookmarkTagEvent) {
		this.startPending();

		await this.createBookmarkTagTask.run([
			{ bookmarkId: event.bookmarkId, tagIds: event.tagIds },
		]);
	}

	async onRemoveBookmarkTag(event: RemoveBookmarkTagEvent) {
		this.startPending();

		await this.removeBookmarkTagTask.run([
			{ bookmarkTagId: event.bookmarkTagId },
		]);
	}

	async onCheckDoneBookmark(event: CheckDoneBookmarkEvent) {
		this.startPending();

		await this.updateBookmarkDoneTask.run([
			{
				done: event.done,
				bookmarkId: event.bookmarkId,
				mastoBookmarkId: event.mastoBookmarkId,
			},
		]);
	}

	async onLoadMoreBookmarks() {
		this.startPending();

		// await this.
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
