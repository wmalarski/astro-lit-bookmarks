export class CreateBookmarkEvent extends Event {
	static readonly eventName = "bookmark-create" as const;

	readonly tagIds: string[];
	readonly mastoBookmarkId: string;

	constructor(mastoBookmarkId: string, tagId: string) {
		super(CreateBookmarkEvent.eventName, { bubbles: true, composed: true });
		this.mastoBookmarkId = mastoBookmarkId;
		this.tagIds = [tagId];
	}
}

export class CreateBookmarkTagEvent extends Event {
	static readonly eventName = "bookmark-tag-create" as const;

	readonly tagIds: string[];
	readonly bookmarkId: string;

	constructor(bookmarkId: string, tagId: string) {
		super(CreateBookmarkTagEvent.eventName, { bubbles: true, composed: true });
		this.bookmarkId = bookmarkId;
		this.tagIds = [tagId];
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
		[CreateBookmarkEvent.eventName]: CreateBookmarkEvent;
		[CreateBookmarkTagEvent.eventName]: CreateBookmarkTagEvent;
		[RemoveBookmarkTagEvent.eventName]: RemoveBookmarkTagEvent;
	}
}
