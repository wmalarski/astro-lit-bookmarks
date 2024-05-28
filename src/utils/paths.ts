import { buildSearchParams } from "./searchParams";

export const paths = {
	index: (page = 1) => `/?${buildSearchParams({ page })}`,
};
