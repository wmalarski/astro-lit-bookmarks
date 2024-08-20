import { UNAUTHORIZED_ERROR } from "@server/errors";
import type { ActionAPIContext } from "@server/types";
import type { APIContext } from "astro";
import { ActionError } from "astro:actions";
import { lucia } from "./lucia";
import { setBlankSessionCookie } from "./session";

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

export const validateContextSession = (context: ActionAPIContext) => {
  const session = context.locals.session;

  if (!session) {
    throw new ActionError(UNAUTHORIZED_ERROR);
  }

  return session;
};
