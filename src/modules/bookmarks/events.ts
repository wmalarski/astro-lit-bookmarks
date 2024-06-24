type CreateBookmarkTagEventArgs = {
	tagIds: string[];
	bookmarkId: string | undefined;
	mastoBookmarkId: string | undefined;
};

export class CreateBookmarkTagEvent extends Event {
	static readonly eventName = "bookmark-tag-create" as const;

	readonly tagIds: string[];
	readonly bookmarkId?: string | undefined;
	readonly mastoBookmarkId?: string | undefined;

	constructor({
		bookmarkId,
		mastoBookmarkId,
		tagIds,
	}: CreateBookmarkTagEventArgs) {
		super(CreateBookmarkTagEvent.eventName, { bubbles: true, composed: true });
		this.bookmarkId = bookmarkId;
		this.mastoBookmarkId = mastoBookmarkId;
		this.tagIds = tagIds;
	}
}

export class RemoveBookmarkTagEvent extends Event {
	static readonly eventName = "bookmark-tag-remove" as const;

	readonly bookmarkTagId: string;

	constructor(bookmarkTagId: string) {
		super(RemoveBookmarkTagEvent.eventName, { bubbles: true, composed: true });
		this.bookmarkTagId = bookmarkTagId;
	}
}

type CheckDoneBookmarkEventArgs = {
	bookmarkId?: string | undefined;
	mastoBookmarkId?: string | undefined;
	done: boolean;
};

export class CheckDoneBookmarkEvent extends Event {
	static readonly eventName = "bookmark-check-done" as const;

	readonly bookmarkId: string | undefined;
	readonly mastoBookmarkId: string | undefined;
	readonly done: boolean;

	constructor({
		done,
		bookmarkId,
		mastoBookmarkId,
	}: CheckDoneBookmarkEventArgs) {
		super(CheckDoneBookmarkEvent.eventName, { bubbles: true, composed: true });
		this.bookmarkId = bookmarkId;
		this.mastoBookmarkId = mastoBookmarkId;
		this.done = done;
	}
}

declare global {
	interface HTMLElementEventMap {
		[CreateBookmarkTagEvent.eventName]: CreateBookmarkTagEvent;
		[RemoveBookmarkTagEvent.eventName]: RemoveBookmarkTagEvent;
		[CheckDoneBookmarkEvent.eventName]: CheckDoneBookmarkEvent;
	}
}
