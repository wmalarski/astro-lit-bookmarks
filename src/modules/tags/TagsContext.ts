import { createContext } from "@lit/context";
import type { tagTable } from "@server/db";
import type { InferSelectModel } from "drizzle-orm";

export type TagsContextValue = {
	tags: InferSelectModel<typeof tagTable>[];
	tagsMap: Map<string, InferSelectModel<typeof tagTable>>;
	optimisticTag: string | null;
	error: string | null;
	removingTagId: string | null;
	showDone: boolean;
};

export const tagsContext = createContext<TagsContextValue>("tags");

export const tagsContextDefault: TagsContextValue = {
	optimisticTag: null,
	tagsMap: new Map(),
	tags: [],
	error: null,
	removingTagId: null,
	showDone: true,
};
