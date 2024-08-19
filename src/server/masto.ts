import type { APIContext } from "astro";
import { createRestAPIClient } from "masto";
import { validateContextSession } from "./auth";
import { buildSearchParams } from "@utils/searchParams";
import type { ActionAPIContext } from "astro/actions/runtime/store.js";
import type { Status } from "@type/mastodon";

export const mastoMiddleware = async (context: APIContext) => {
  const accessToken = context.locals.session?.accessToken;
  if (!accessToken) {
    return;
  }

  const mastoRestAPIClient = createRestAPIClient({
    url: import.meta.env.MASTODON_URL,
    accessToken,
  });

  context.locals.mastoClient = mastoRestAPIClient;
};

type ListMastoBookmarksArgs = {
  maxId: string | null;
};

export const listMastoBookmarks = async (
  context: ActionAPIContext,
  { maxId }: ListMastoBookmarksArgs,
) => {
  const session = validateContextSession(context);

  const params = buildSearchParams({ max_id: maxId, limit: 10 });

  const response = await fetch(
    `${import.meta.env.MASTODON_URL}/api/v1/bookmarks?${params}`,
    { headers: { Authorization: `bearer ${session.accessToken}` } },
  );

  const mastoBookmarks: Status[] = await response.json();

  const link = response.headers.get("link");
  const minId = link?.match(/min_id=(\d+)>/)?.[1] || null;
  const newMaxId = link?.match(/max_id=(\d+)>/)?.[1] || null;

  const last = mastoBookmarks[mastoBookmarks.length - 1];
  const startDate = last ? new Date(last.created_at) : null;

  return { mastoBookmarks, minId, startDate, maxId: newMaxId };
};
