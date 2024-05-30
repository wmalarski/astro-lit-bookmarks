import { buildSearchParams } from "./searchParams";

export const paths = {
	index: (page = 1) => `/?${buildSearchParams({ page })}`,
	login: "/login",
	loginMastodon: "/login/mastodon",
	logout: "/logout",
};
