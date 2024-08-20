import { validateContextSession } from "@server/auth/middleware";
import type { Status } from "@server/masto/types";
import type { ActionAPIContext } from "@server/types";
import { buildSearchParams } from "@utils/searchParams";
import type { Tokens } from "arctic";
import { createRestAPIClient } from "masto";

export const verifyMastoCredentials = (tokens: Tokens) => {
  const client = createRestAPIClient({
    url: import.meta.env.MASTODON_URL,
    accessToken: tokens.accessToken,
  });

  return client.v1.accounts.verifyCredentials();
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
