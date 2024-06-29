// import { type Account } from "./account";
// import { type Application } from "./application";
// import { type CustomEmoji } from "./custom-emoji";
// import { type FilterResult } from "./filter-result";
// import { type MediaAttachment } from "./media-attachment";
// import { type Poll } from "./poll";
// import { type PreviewCard } from "./preview-card";
// import { type Tag } from "./tag";

/**
 * Represents display or publishing preferences of user's own account.
 * Returned as an additional entity when verifying and updated credentials, as an attribute of Account.
 * @see https://docs.joinmastodon.org/entities/source/
 */
export interface AccountSource {
	/** Profile bio. */
	note: string;
	/** Metadata about the account. */
	fields: AccountField;

	/** The default post privacy to be used for new statuses. */
	privacy?: StatusVisibility | null;
	/** Whether new statuses should be marked sensitive by default. */
	sensitive?: boolean | null;
	/** The default posting language for new statuses. */
	language: string | null;
	/** The number of pending follow requests. */
	followRequestsCount?: number | null;
}

/**
 * Represents a profile field as a name-value pair with optional verification.
 */
export interface AccountField {
	/** The key of a given field's key-value pair. */
	name: string;
	/** The value associated with the `name` key. */
	value: string;

	/** Timestamp of when the server verified a URL value for a rel="me” link. */
	verifiedAt?: string | null;
}

/**
 * Represents a user of Mastodon and their associated profile.
 * @see https://docs.joinmastodon.org/entities/account/
 */
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
	displayName: string;
	/** The profile's bio / description. */
	note: string;
	/** An image icon that is shown next to statuses and in the profile. */
	avatar: string;
	/** A static version of the `avatar`. Equal to avatar if its value is a static image; different if `avatar` is an animated GIF. */
	avatarStatic: string;
	/** An image banner that is shown above the profile and in profile cards. */
	header: string;
	/** A static version of the header. Equal to `header` if its value is a static image; different if `header` is an animated GIF. */
	headerStatic: string;
	/** Whether the account manually approves follow requests. */
	locked: boolean;
	/** Additional metadata attached to a profile as name-value pairs. */
	fields: AccountField[];
	/** Custom emoji entities to be used when rendering the profile. If none, an empty array will be returned. */
	// emojis: CustomEmoji[];
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
	createdAt: string;
	/** Time of the last status posted */
	lastStatusAt: string;
	/** How many statuses are attached to this account. */
	statusesCount: number;
	/** The reported followers of this profile. */
	followersCount: number;
	/** The reported follows of this profile. */
	followingCount: number;
	/** Roles that have been granted to this account. */
	// roles: Pick<Role, "id" | "name" | "color">[]; // TODO: Create an entity when documentation is updated
	/** https://github.com/mastodon/mastodon/pull/23591 */
	memorial?: boolean | null;
}

/**
 * @see https://docs.joinmastodon.org/entities/Account/#CredentialAccount
 */
export interface AccountCredentials extends Account {
	/**
	 * Note the extra `source` property, which is not visible on accounts other than your own.
	 * Also note that plain-text is used within `source` and HTML is used for their
	 * corresponding properties such as `note` and `fields`.
	 */
	source: AccountSource;
	/** The role assigned to the currently authorized user. */
	// role: Role;
}

export type PreviewCardType = "link" | "photo" | "video" | "rich";

/**
 * Represents a rich preview card that is generated using OpenGraph tags from a URL.
 * @see https://docs.joinmastodon.org/entities/PreviewCard
 */
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
	authorName?: string | null;
	/** A link to the author of the original resource. */
	authorUrl?: string | null;
	/** The provider of the original resource. */
	providerName?: string | null;
	/** A link to the provider of the original resource. */
	providerUrl?: string | null;
	/** HTML to be used for generating the preview card. */
	html?: string | null;
	/** Width of preview, in pixels. */
	width?: number | null;
	/** Height of preview, in pixels. */
	height?: number | null;
	/** Preview thumbnail. */
	image?: string | null;
	/** Used for photo embeds, instead of custom `html`. */
	embedUrl: string;
	/** @see https://github.com/mastodon/mastodon/pull/27503 */
	language?: string;
}

// export interface TrendLink extends PreviewCard {
//   history: TagHistory[];
// }

/**
 * Represents a mention of a user within the content of a status.
 * @see https://docs.joinmastodon.org/entities/mention/
 */
export interface StatusMention {
	/** The account id of the mentioned user. */
	id: string;
	/** The username of the mentioned user. */
	username: string;
	/** The location of the mentioned user's profile. */
	url: string;
	/**
	 * The WebFinger acct: URI of the mentioned user.
	 * Equivalent to username for local users, or `username@domain` for remote users.
	 */
	acct: string;
}

export type StatusVisibility = "public" | "unlisted" | "private" | "direct";

/**
 * Represents a status posted by an account.
 * @see https://docs.joinmastodon.org/entities/status/
 */
export interface Status {
	/** ID of the status in the database. */
	id: string;
	/** URI of the status used for federation. */
	uri: string;
	/** The date when this status was created. */
	createdAt: string;
	/** Timestamp of when the status was last edited. */
	editedAt: string | null;
	/** The account that authored this status. */
	account: Account;
	/** HTML-encoded status content. */
	content: string;
	/** Visibility of this status. */
	visibility: StatusVisibility;
	/** Is this status marked as sensitive content? */
	sensitive: boolean;
	/** Subject or summary line, below which status content is collapsed until expanded. */
	spoilerText: string;
	/** Media that is attached to this status. */
	// mediaAttachments: MediaAttachment[];
	/** The application used to post this status. */
	// application: Application;

	/** Mentions of users within the status content. */
	mentions: StatusMention[];
	/** Hashtags used within the status content. */
	// tags: Tag[];
	/** Custom emoji to be used when rendering status content. */
	// emojis: CustomEmoji[];

	/** How many boosts this status has received. */
	reblogsCount: number;
	/** How many favourites this status has received. */
	favouritesCount: number;
	/** If the current token has an authorized user: The filter and keywords that matched this status. */
	// filtered?: FilterResult[];
	/** How many replies this status has received. */
	repliesCount: number;

	/** A link to the status's HTML representation. */
	url?: string | null;
	/** ID of the status being replied. */
	inReplyToId?: string | null;
	/** ID of the account being replied to. */
	inReplyToAccountId?: string | null;
	/** The status being reblogged. */
	reblog?: Status | null;
	/** The poll attached to the status. */
	// poll?: Poll | null;
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
