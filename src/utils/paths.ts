import { buildSearchParams } from "./searchParams";

export const paths = {
	index: (done = false) => `/?${buildSearchParams({ done })}`,
	login: "/login",
	loginMastodon: "/login/mastodon",
	logout: "/logout",
};
