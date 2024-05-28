import type { APIContext } from "astro";

export const mastoMiddleware = async (context: APIContext) => {
	console.log(context.locals);

	// const mastoRestAPIClient = createRestAPIClient({
	// 	url: import.meta.env.MASTODON_URL,
	// 	accessToken: import.meta.env.MASTODON_ACCESS_TOKEN,
	// });

	// const mastoOAuthAPIClient = createOAuthAPIClient({
	// 	url: import.meta.env.MASTODON_URL,
	// 	accessToken: import.meta.env.MASTODON_ACCESS_TOKEN,
	// });

	// mastoRestAPIClient.v1.bookmarks.list({

	// })

	// const token = await mastoOAuthAPIClient.token.create({
	// 	clientId,
	// 	clientSecret,
	// 	code,
	// 	grantType,
	// 	redirectUri,
	// });

	// const mastoClient = createRestAPIClient({
	// 	url: import.meta.env.MASTODON_URL,
	// 	accessToken: import.meta.env.MASTODON_ACCESS_TOKEN,
	// });

	// mastoClient.v1;

	// context.locals.mastoClient = mastoRestAPIClient;
};
