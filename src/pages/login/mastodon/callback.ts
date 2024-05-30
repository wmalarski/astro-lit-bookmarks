import { OAuth2RequestError } from "arctic";

import type { APIContext } from "astro";
import { paths } from "@utils/paths";
import { setSessionCookie, validateAuthorizationCode } from "@server/auth";
import {
	getUserByMastoId,
	insertUser,
	verifyMastoCredentials,
} from "@server/user";

export const GET = async (context: APIContext): Promise<Response> => {
	try {
		const tokens = await validateAuthorizationCode(context);

		console.log({ tokens });

		if (!tokens) {
			return new Response(null, { status: 400 });
		}

		const mastoUser = await verifyMastoCredentials(tokens);

		console.log({ mastoUser });

		const existingUser = getUserByMastoId(mastoUser.id);

		console.log({ existingUser });

		if (existingUser) {
			await setSessionCookie(context, existingUser.id);

			return context.redirect(paths.index());
		}

		const newUser = insertUser(mastoUser);

		console.log({ newUser });

		await setSessionCookie(context, newUser.id);

		return context.redirect(paths.index());
	} catch (error) {
		console.error({ error });

		if (error instanceof OAuth2RequestError) {
			return new Response(null, { status: 400 });
		}

		return new Response(null, { status: 500 });
	}
};
