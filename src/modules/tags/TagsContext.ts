import { createContext } from "@lit/context";
import type { tagTable } from "@server/db";
import type { InferSelectModel } from "drizzle-orm";

export type TagsContextValue = {
	tags: InferSelectModel<typeof tagTable>[];
	optimisticTag: string | null;
};

export const tagsContext = createContext<TagsContextValue>("tags");

export const tagsContextDefault: TagsContextValue = {
	optimisticTag: null,
	tags: [],
};
