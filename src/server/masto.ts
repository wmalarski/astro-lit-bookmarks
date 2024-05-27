import { createRestAPIClient, createOAuthAPIClient } from "masto";

const masto = createRestAPIClient({
	url: process.env.URL,
	accessToken: process.env.TOKEN,
}).v1.bookmarks.list();

createOAuthAPIClient({});
