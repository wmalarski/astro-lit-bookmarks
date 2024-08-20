import { authMiddleware } from "@server/auth/middleware";
import { verifyRequest } from "@server/auth/session";
import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  if (context.request.method !== "GET") {
    if (!verifyRequest(context)) {
      return new Response(null, { status: 403 });
    }
  }

  await authMiddleware(context);

  return next();
});
