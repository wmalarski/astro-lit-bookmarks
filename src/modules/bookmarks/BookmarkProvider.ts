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

type BookmarkProviderProps = {
	value: BookmarkContextValue;
};

@customElement("alb-bookmark-provider")
export class BookmarkProvider extends LitElement {
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
		task: ([id, tagId]) =>
			actions.createBookmark({ tagIds: [tagId], mastoBookmarkId: id }),
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

	private createBookmarkTagsTask = new Task<
		[string, string],
		Awaited<ReturnType<typeof actions.createBookmarkTags>>
	>(this, {
		autoRun: false,
		task: ([id, tagId]) =>
			actions.createBookmarkTags({ tagIds: [tagId], bookmarkId: id }),
		onComplete: (result) => {
			const resultBookmarkTag = result[0];
			const tag = this.tagsContext.tags.find(
				(tag) => tag.id === resultBookmarkTag?.tagId,
			);

			if (!resultBookmarkTag) {
				return;
			}

			this.value = {
				...this.value,
				isPending: false,
				bookmarks: this.value.bookmarks.map((entry) =>
					entry.bookmark?.id === resultBookmarkId
						? { ...entry, tags: [...result, ...entry.tags] }
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

	private deleteTagTask = new Task<
		[string],
		Awaited<ReturnType<typeof actions.deleteTag>>
	>(this, {
		autoRun: false,
		task: ([tagId]) => actions.deleteTag({ tagId }),
		onComplete: (result) => {
			this.value = {
				...this.value,
				// bookmarks:
				tags: this.value.tags.filter((tag) => tag.id !== result.tag.id),
				removingTagId: null,
			};
		},
		onError: () => {
			this.value = {
				...this.value,
				error: "Error removing tag",
				removingTagId: null,
			};
		},
	});

	override render() {
		return html`<slot
            @tag-submit-new=${this.onSubmitNewTag}
            @tag-delete=${this.onDeleteTag}
        ></slot>`;
	}

	async onSubmitNewTag(event: SubmitNewTagEvent) {
		this.value = {
			...this.value,
			optimisticTag: event.name,
			error: null,
		};

		await this.createBookmarkTask.run([event.name]);
	}

	onDeleteTag = async (event: DeleteTagEvent) => {
		this.value = {
			...this.value,
			removingTagId: event.tagId,
			error: null,
		};

		await this.deleteTagTask.run([event.tagId]);
	};
}

declare global {
	interface HTMLElementTagNameMap {
		"alb-bookmark-provider": BookmarkProvider;
	}
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type BookmarkProviderComponent = (props: BookmarkProviderProps) => any;

export const TypedBookmarkProvider =
	BookmarkProvider as unknown as BookmarkProviderComponent;
