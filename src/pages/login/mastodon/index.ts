import { createAuthorizationUrl } from "@server/auth/session";
import type { APIContext } from "astro";

export const GET = async (context: APIContext): Promise<Response> => {
  const url = await createAuthorizationUrl();

  return context.redirect(url);
};
