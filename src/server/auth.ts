import { generateCodeVerifier, generateState } from "arctic";

import type { APIContext, AstroCookieSetOptions } from "astro";
import { client, lucia } from "@server/session";
import { verifyRequestOrigin } from "lucia";

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

	console.log({ state, codeVerifier });

	return url.toString();
};

export const validateAuthorizationCode = (
	context: APIContext,
): Promise<unknown | null> => {
	const code = context.url.searchParams.get(CODE_KEY);
	const state = context.url.searchParams.get(STATE_KEY);

	const storedState = context.cookies.get(STATE_KEY)?.value;
	const storedCodeVerifier = context.cookies.get(CODE_VERIFIER_KEY)?.value;

	console.log({
		code,
		state,
		storedState,
		storedCodeVerifier,
		sp: Object.fromEntries(context.url.searchParams.entries()),
		ck: Array.from(context.cookies.headers()),
	});

	if (!code || !storedState || !storedCodeVerifier || state !== storedState) {
		return Promise.resolve(null);
	}

	const body = new URLSearchParams();
	body.set("code", authorizationCode);
	body.set("client_id", this.clientId);
	body.set("grant_type", "authorization_code");
	if (this.redirectURI !== null) {
		body.set("redirect_uri", this.redirectURI);
	}
	if (options?.codeVerifier !== undefined) {
		body.set("code_verifier", options.codeVerifier);
	}

	const headers = new Headers();
        headers.set("Content-Type", "application/x-www-form-urlencoded");
        headers.set("Accept", "application/json");
        headers.set("User-Agent", "oslo");
        if (options?.credentials !== undefined) {
            const authenticateWith = options?.authenticateWith ?? "http_basic_auth";
            if (authenticateWith === "http_basic_auth") {
                const encodedCredentials = base64.encode(new TextEncoder().encode(`${this.clientId}:${options.credentials}`));
                headers.set("Authorization", `Basic ${encodedCredentials}`);
            }
            else if (authenticateWith === "request_body") {
                body.set("client_secret", options.credentials);
            }
            else {
                throw new TypeError(`Invalid value for 'authenticateWith': ${authenticateWith}`);
            }
        }
        const request = new Request(this.tokenEndpoint, {
            method: "POST",
            headers,
            body
        });
        const response = await fetch(request);
        const result = await response.json();
        // providers are allowed to return non-400 status code for errors
        if (!("access_token" in result) && "error" in result) {
            throw new OAuth2RequestError(request, result);
        }
        else if (!response.ok) {
            throw new OAuth2RequestError(request, {});
        }
        return result;

	return client.validateAuthorizationCode(code, {
		codeVerifier: storedCodeVerifier,
	});
};

export const setSessionCookie = async (context: APIContext, userId: string) => {
	const session = await lucia.createSession(userId, {});
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

export const authMiddleware = async (context: APIContext) => {
	const sessionId = context.cookies.get(lucia.sessionCookieName)?.value ?? null;

	if (!sessionId) {
		context.locals.user = null;
		context.locals.session = null;
		return;
	}

	const { session, user } = await lucia.validateSession(sessionId);

	if (session?.fresh) {
		const sessionCookie = lucia.createSessionCookie(session.id);

		context.cookies.set(
			sessionCookie.name,
			sessionCookie.value,
			sessionCookie.attributes,
		);
	}

	if (!session) {
		setBlankSessionCookie(context);
	}

	context.locals.session = session;
	context.locals.user = user;
};
