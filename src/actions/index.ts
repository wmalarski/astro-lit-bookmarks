import { bookmarks } from "./bookmarks";
import { tags } from "./tags";

export const server = {
	...tags,
	...bookmarks,
};
