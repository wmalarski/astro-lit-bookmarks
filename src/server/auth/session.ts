import { type Tokens, generateCodeVerifier, generateState } from "arctic";

import { client, lucia } from "@server/auth/lucia";
import type { APIContext, AstroCookieSetOptions } from "astro";
import { verifyRequestOrigin } from "lucia";
import { createOAuthAPIClient } from "masto";

const CODE_KEY = "code";
const CODE_VERIFIER_KEY = "code_verifier";
const STATE_KEY = "state";

const COOKIE_OPTIONS: AstroCookieSetOptions = {
  httpOnly: true,
  maxAge: 60 * 10, // 10 min
  path: "/",
  secure: import.meta.env.PROD,
};

export const createAuthorizationUrl = async (
  context: APIContext,
): Promise<string> => {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();

  const url = await client.createAuthorizationURL({
    state,
    codeVerifier,
    scopes: ["read"],
  });

  context.cookies.set(STATE_KEY, state, COOKIE_OPTIONS);
  context.cookies.set(CODE_VERIFIER_KEY, codeVerifier, COOKIE_OPTIONS);

  console.log({ url, state, codeVerifier });

  return url.toString();
};

export const validateAuthorizationCode = async (
  context: APIContext,
): Promise<Tokens | null> => {
  const code = context.url.searchParams.get(CODE_KEY);
  const state = context.url.searchParams.get(STATE_KEY);

  const storedState = context.cookies.get(STATE_KEY)?.value;
  const storedCodeVerifier = context.cookies.get(CODE_VERIFIER_KEY)?.value;

  if (!code || !storedState || !storedCodeVerifier || state !== storedState) {
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