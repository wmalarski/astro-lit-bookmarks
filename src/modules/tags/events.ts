import type { tagTable } from "@server/db";
import type { InferSelectModel } from "drizzle-orm";

export class SubmitNewTagEvent extends Event {
	static readonly eventName = "tag-submit-new" as const;

	readonly name: string;

	constructor(name: string) {
		super(SubmitNewTagEvent.eventName, { bubbles: true, composed: true });
		this.name = name;
	}
}

export class CreateTagEvent extends Event {
	static readonly eventName = "tag-create" as const;

	readonly tag: InferSelectModel<typeof tagTable>;

	constructor(tag: InferSelectModel<typeof tagTable>) {
		super(CreateTagEvent.eventName, { bubbles: true, composed: true });
		this.tag = tag;
	}
}

export class SubmitTagFailEvent extends Event {
	static readonly eventName = "tag-submit-fail" as const;

	constructor() {
		super(SubmitTagFailEvent.eventName, { bubbles: true, composed: true });
	}
}

export class DeleteTagEvent extends Event {
	static readonly eventName = "tag-delete" as const;

	readonly tagId: string;

	constructor(tagId: string) {
		super(DeleteTagEvent.eventName, { bubbles: true, composed: true });
		this.tagId = tagId;
	}
}

declare global {
	interface HTMLElementEventMap {
		[SubmitNewTagEvent.eventName]: SubmitNewTagEvent;
		[CreateTagEvent.eventName]: CreateTagEvent;
		[SubmitTagFailEvent.eventName]: SubmitTagFailEvent;
		[DeleteTagEvent.eventName]: DeleteTagEvent;
	}
}
