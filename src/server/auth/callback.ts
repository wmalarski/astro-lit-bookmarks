import { OAuth2RequestError } from "arctic";

import {
  setSessionCookie,
  validateAuthorizationCode,
} from "@server/auth/session";
import { getUserByMastoId, insertUser } from "@server/data/user";
import { verifyMastoCredentials } from "@server/masto/helpers";
import { paths } from "@utils/paths";
import type { APIContext } from "astro";

export const handleAuthCallback = async (
  context: APIContext,
): Promise<Response> => {
  try {
    const tokens = await validateAuthorizationCode(context);

    if (!tokens) {
      return new Response(null, { status: 400 });
    }

    const mastoUser = await verifyMastoCredentials(tokens);

    const existingUser = getUserByMastoId(mastoUser.id);

    if (existingUser) {
      await setSessionCookie(context, existingUser.id, tokens);

      return context.redirect(paths.index);
    }

    const newUser = insertUser(mastoUser);

    await setSessionCookie(context, newUser.id, tokens);

    return context.redirect(paths.index);
  } catch (error) {
    console.error({ error });

    if (error instanceof OAuth2RequestError) {
      return new Response(null, { status: 400 });
    }

    return new Response(null, { status: 500 });
  }
};
