export class CreateBookmarkEvent extends Event {
	static readonly eventName = "bookmark-create" as const;

	readonly tagId: string;
	readonly mastoBookmarkId: string;

	constructor(mastoBookmarkId: string, tagId: string) {
		super(CreateBookmarkEvent.eventName, { bubbles: true, composed: true });
		this.mastoBookmarkId = mastoBookmarkId;
		this.tagId = tagId;
	}
}

export class CreateBookmarkTagEvent extends Event {
	static readonly eventName = "bookmark-tag-create" as const;

	readonly tagId: string;
	readonly bookmarkId: string;

	constructor(bookmarkId: string, tagId: string) {
		super(CreateBookmarkTagEvent.eventName, { bubbles: true, composed: true });
		this.bookmarkId = bookmarkId;
		this.tagId = tagId;
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

declare global {
	interface HTMLElementEventMap {
		[CreateBookmarkEvent.eventName]: CreateBookmarkEvent;
		[CreateBookmarkTagEvent.eventName]: CreateBookmarkTagEvent;
		[RemoveBookmarkTagEvent.eventName]: RemoveBookmarkTagEvent;
	}
}
