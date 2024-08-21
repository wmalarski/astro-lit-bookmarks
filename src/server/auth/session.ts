import type { Tokens } from "arctic";

import { lucia } from "@server/auth/lucia";
import { buildSearchParams } from "@utils/searchParams";
import type { APIContext } from "astro";
import { verifyRequestOrigin } from "lucia";
import { createOAuthAPIClient } from "masto";

const CODE_KEY = "code";

export const createAuthorizationUrl = async (): Promise<string> => {
  const params = buildSearchParams({
    response_type: "code",
    client_id: import.meta.env.MASTODON_CLIENT_ID,
    redirect_uri: import.meta.env.MASTODON_REDIRECT_URL,
    scope: "read",
  });

  const url = new URL(
    `/oauth/authorize?${params.toString()}`,
    import.meta.env.MASTODON_URL,
  );

  return url.toString();
};

export const validateAuthorizationCode = async (
  context: APIContext,
): Promise<Tokens | null> => {
  const code = context.url.searchParams.get(CODE_KEY);

  if (!code) {
    return Promise.resolve(null);
  }

  const client = createOAuthAPIClient({ url: import.meta.env.MASTODON_URL });

  return client.token.create({
    clientId: import.meta.env.MASTODON_CLIENT_ID,
    clientSecret: import.meta.env.MASTODON_CLIENT_SECRET,
    code,
    grantType: "authorization_code",
    redirectUri: import.meta.env.MASTODON_REDIRECT_URL,
  });
};

export const setSessionCookie = async (
  context: APIContext,
  userId: string,
  tokens: Tokens,
) => {
  const session = await lucia.createSession(userId, {
    accessToken: tokens.accessToken,
  });

  const sessionCookie = lucia.createSessionCookie(session.id);

  context.cookies.set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
};

export const setBlankSessionCookie = (context: APIContext) => {
  const sessionCookie = lucia.createBlankSessionCookie();

  context.cookies.set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
};

export const verifyRequest = (context: APIContext) => {
  const originHeader = context.request.headers.get("Origin");
  const hostHeader = context.request.headers.get("Host");

  return (
    originHeader &&
    hostHeader &&
    verifyRequestOrigin(originHeader, [hostHeader])
  );
};
