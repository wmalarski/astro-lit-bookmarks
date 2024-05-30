import type { APIContext } from "astro";
import { createRestAPIClient } from "masto";

export const mastoMiddleware = async (context: APIContext) => {
	const accessToken = context.locals.session?.accessToken;
	if (!accessToken) {
		return;
	}

	const mastoRestAPIClient = createRestAPIClient({
		url: import.meta.env.MASTODON_URL,
		accessToken,
	});

	context.locals.mastoClient = mastoRestAPIClient;
};
