export class SubmitNewTagEvent extends Event {
  static readonly eventName = "tag-submit-new" as const;

  readonly name: string;

  constructor(name: string) {
    super(SubmitNewTagEvent.eventName, { bubbles: true, composed: true });
    this.name = name;
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
    [DeleteTagEvent.eventName]: DeleteTagEvent;
  }
}
