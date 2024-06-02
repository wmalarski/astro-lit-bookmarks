export class CreateTagEvent extends Event {
	static readonly eventName = "tag-create" as const;

	readonly name: string;

	constructor(name: string) {
		super(CreateTagEvent.eventName, { bubbles: true, composed: true });
		this.name = name;
	}
}

export class DeleteTagEvent extends Event {
	static readonly eventName = "tag-delete" as const;

	readonly id: string;

	constructor(id: string) {
		super(DeleteTagEvent.eventName, { bubbles: true, composed: true });
		this.id = id;
	}
}

declare global {
	interface HTMLElementEventMap {
		[CreateTagEvent.eventName]: CreateTagEvent;
		[DeleteTagEvent.eventName]: DeleteTagEvent;
	}
}
