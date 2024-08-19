import { defineMiddleware } from "astro:middleware";
import { authMiddleware, verifyRequest } from "@server/auth";
import { mastoMiddleware } from "@server/masto";

export const onRequest = defineMiddleware(async (context, next) => {
  if (context.request.method !== "GET") {
    if (!verifyRequest(context)) {
      return new Response(null, { status: 403 });
    }
  }

  await authMiddleware(context);
  await mastoMiddleware(context);

  return next();
});
