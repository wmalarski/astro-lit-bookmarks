export interface Account {
  /** The account id */
  id: string;
  /** The username of the account, not including domain */
  username: string;
  /** The WebFinger account URI. Equal to `username` for local users, or `username@domain` for remote users. */
  acct: string;
  /** The location of the user's profile page. */
  url: string;
  /** The profile's display name. */
  display_name: string;
  /** The profile's bio / description. */
  note: string;
  /** An image icon that is shown next to statuses and in the profile. */
  avatar: string;
  /** A static version of the `avatar`. Equal to avatar if its value is a static image; different if `avatar` is an animated GIF. */
  avatar_static: string;
  /** An image banner that is shown above the profile and in profile cards. */
  header: string;
  /** A static version of the header. Equal to `header` if its value is a static image; different if `header` is an animated GIF. */
  header_static: string;
  /** Whether the account manually approves follow requests. */
  locked: boolean;
  /** Boolean to indicate that the account performs automated actions */
  bot: boolean;
  /** Indicates that the account represents a Group actor. */
  group: boolean;
  /** Whether the account has opted into discovery features such as the profile directory. */
  discoverable?: boolean | null;
  /** Whether the local user has opted out of being indexed by search engines. */
  noindex?: boolean | null;
  /** Indicates that the profile is currently inactive and that its user has moved to a new account. */
  moved?: Account | null;
  /** An extra entity returned when an account is suspended. **/
  suspended?: boolean | null;
  /** An extra attribute returned only when an account is silenced. If true, indicates that the account should be hidden behind a warning screen. */
  limited?: boolean | null;
  /** When the account was created. */
  created_at: string;
  /** Time of the last status posted */
  last_status_at: string;
  /** How many statuses are attached to this account. */
  statuses_count: number;
  /** The reported followers of this profile. */
  followers_count: number;
  /** The reported follows of this profile. */
  following_count: number;
}

export type PreviewCardType = "link" | "photo" | "video" | "rich";

export interface PreviewCard {
  /** Location of linked resource. */
  url: string;
  /** Title of linked resource. */
  title: string;
  /** Description of preview. */
  description: string;
  /** The type of the preview card. */
  type: PreviewCardType;
  /** Blurhash */
  blurhash: string;
  /** The author of the original resource. */
  author_name?: string | null;
  /** A link to the author of the original resource. */
  author_url?: string | null;
  /** The provider of the original resource. */
  provider_name?: string | null;
  /** A link to the provider of the original resource. */
  provider_url?: string | null;
  /** HTML to be used for generating the preview card. */
  html?: string | null;
  /** Width of preview, in pixels. */
  width?: number | null;
  /** Height of preview, in pixels. */
  height?: number | null;
  /** Preview thumbnail. */
  image?: string | null;
  /** Used for photo embeds, instead of custom `html`. */
  embed_url: string;
}

export type StatusVisibility = "public" | "unlisted" | "private" | "direct";

export interface Status {
  /** ID of the status in the database. */
  id: string;
  /** URI of the status used for federation. */
  uri: string;
  /** The date when this status was created. */
  created_at: string;
  /** Timestamp of when the status was last edited. */
  edited_at: string | null;
  /** The account that authored this status. */
  account: Account;
  /** HTML-encoded status content. */
  content: string;
  /** Visibility of this status. */
  visibility: StatusVisibility;
  /** Is this status marked as sensitive content? */
  sensitive: boolean;
  /** Subject or summary line, below which status content is collapsed until expanded. */
  spoiler_text: string;
  /** How many boosts this status has received. */
  reblogs_count: number;
  /** How many favourites this status has received. */
  favourites_count: number;
  /** How many replies this status has received. */
  replies_count: number;
  /** A link to the status's HTML representation. */
  url?: string | null;
  /** ID of the status being replied. */
  in_reply_to_id?: string | null;
  /** ID of the account being replied to. */
  in_reply_to_account_id?: string | null;
  /** The status being reblogged. */
  reblog?: Status | null;
  /** Preview card for links included within status content. */
  card?: PreviewCard | null;
  /** Primary language of this status. */
  language?: string | null;
  /**
   * Plain-text source of a status. Returned instead of `content` when status is deleted,
   * so the user may redraft from the source text without the client having
   * to reverse-engineer the original text from the HTML content.
   */
  text?: string | null;
  /** Have you favourited this status? */
  favourited?: boolean | null;
  /** Have you boosted this status? */
  reblogged?: boolean | null;
  /** Have you muted notifications for this status's conversation? */
  muted?: boolean | null;
  /** Have you bookmarked this status? */
  bookmarked?: boolean | null;
  /** Have you pinned this status? Only appears if the status is pin-able. */
  pinned?: boolean | null;
}
