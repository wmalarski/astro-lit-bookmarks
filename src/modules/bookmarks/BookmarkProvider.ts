import { LitElement, html } from "lit";
import { consume, provide } from "@lit/context";
import { customElement, property } from "lit/decorators.js";
import { Task } from "@lit/task";
import { actions } from "astro:actions";
import { bookmarkContext, type BookmarkContextValue } from "./BookmarkContext";
import { tagsContext, type TagsContextValue } from "@modules/tags/TagsContext";
import type {
	CheckDoneBookmarkEvent,
	CreateBookmarkTagEvent,
	RemoveBookmarkEvent,
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
	value!: BookmarkContextValue;

	@consume({ context: tagsContext, subscribe: true })
	tagsContext!: TagsContextValue;

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

	private removeBookmarkTask = new Task<
		Parameters<typeof actions.removeBookmark>,
		Awaited<ReturnType<typeof actions.removeBookmark>>
	>(this, {
		autoRun: false,
		task: ([args]) => actions.removeBookmark(args),
		onComplete: (result) => {
			this.value = {
				...this.value,
				isPending: false,
				error: null,
				bookmarks: this.value.bookmarks.flatMap((entry) =>
					entry.bookmark?.id === result.id ? [] : [entry],
				),
			};
		},
		onError: (error) => {
			console.error(error);
			this.value = {
				...this.value,
				isPending: false,
				error: "Bookmark remove error",
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
				minId: result.minId,
				maxId: result.maxId,
				startDate: result.startDate,
				bookmarks: [...this.value.bookmarks, ...result.matchedBookmarks],
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
			@bookmark-remove=${this.onRemoveBookmark}
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
			{
				bookmarkId: event.bookmarkId,
				tagIds: event.tagIds,
				mastoBookmarkId: event.mastoBookmarkId,
			},
		]);
	}

	async onRemoveBookmark(event: RemoveBookmarkEvent) {
		this.startPending();

		await this.removeBookmarkTask.run([{ bookmarkId: event.bookmarkId }]);
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
		if (!this.value.maxId) {
			return;
		}
		this.startPending();
		await this.findBookmarksTask.run([
			{
				done: this.value.showDone,
				endDate: new Date(),
				maxId: this.value.maxId,
			},
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
