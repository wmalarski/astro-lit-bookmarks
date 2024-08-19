import { LitElement, html } from "lit";
import { provide } from "@lit/context";
import { customElement, property } from "lit/decorators.js";
import {
  tagsContext,
  tagsContextDefault,
  type TagsContextValue,
} from "./TagsContext";
import type { DeleteTagEvent, SubmitNewTagEvent } from "./events";
import { Task } from "@lit/task";
import { actions } from "astro:actions";

type TagsListProps = {
  value: TagsContextValue;
};

@customElement(TagsProvider.elementName)
export class TagsProvider extends LitElement {
  static readonly elementName = "tags-provider" as const;

  @provide({ context: tagsContext })
  @property({ attribute: false })
  value: TagsContextValue = tagsContextDefault;

  private createTagTask = new Task<
    Parameters<typeof actions.createTag>,
    Awaited<ReturnType<typeof actions.createTag>>
  >(this, {
    autoRun: false,
    task: ([args]) => actions.createTag(args),
    onComplete: (result) => {
      const tagsMap = new Map(this.value.tagsMap);
      tagsMap.set(result.id, result);
      this.value = {
        ...this.value,
        optimisticTag: null,
        tags: [result, ...this.value.tags],
        tagsMap,
        error: null,
      };
    },
    onError: () => {
      this.value = {
        ...this.value,
        optimisticTag: null,
        error: "Tag submission error",
      };
    },
  });

  private deleteTagTask = new Task<
    Parameters<typeof actions.deleteTag>,
    Awaited<ReturnType<typeof actions.deleteTag>>
  >(this, {
    autoRun: false,
    task: ([args]) => actions.deleteTag(args),
    onComplete: (result) => {
      const tagsMap = new Map(this.value.tagsMap);
      tagsMap.delete(result.id);
      this.value = {
        ...this.value,
        tagsMap,
        tags: this.value.tags.filter((tag) => tag.id !== result.id),
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

    await this.createTagTask.run([{ name: event.name }]);
  }

  onDeleteTag = async (event: DeleteTagEvent) => {
    this.value = {
      ...this.value,
      removingTagId: event.tagId,
      error: null,
    };

    await this.deleteTagTask.run([{ tagId: event.tagId }]);
  };
}

declare global {
  interface HTMLElementTagNameMap {
    [TagsProvider.elementName]: TagsProvider;
  }
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type TagsProviderComponent = (props: TagsListProps) => any;

export const TypedTagsProvider =
  TagsProvider as unknown as TagsProviderComponent;
