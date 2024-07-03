import sqlite from "better-sqlite3";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { drizzle } from "drizzle-orm/better-sqlite3";

const sqliteDB = sqlite(import.meta.env.DB_URL);

export const db = drizzle(sqliteDB);

export const userTable = sqliteTable("user", {
	id: text("id").notNull().primaryKey(),
	name: text("name").notNull(),
});

export const sessionTable = sqliteTable("session", {
	id: text("id").notNull().primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => userTable.id, { onDelete: "cascade" }),
	expiresAt: integer("expires_at").notNull(),
	accessToken: text("access_token").notNull(),
});

export const bookmarkTable = sqliteTable("bookmark", {
	id: text("id").notNull().primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => userTable.id, { onDelete: "cascade" }),
	content: text("content"),
	title: text("title"),
	url: text("url"),
	mastoBookmarkId: text("masto_bookmark_id"),
	priority: integer("priority").default(0).notNull(),
	done: integer("done", { mode: "boolean" }).default(false).notNull(),
	createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const tagTable = sqliteTable("tag", {
	id: text("id").notNull().primaryKey(),
	name: text("name").notNull(),
});

export const bookmarkTagTable = sqliteTable("bookmark_tag", {
	id: text("id").notNull().primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => userTable.id, { onDelete: "cascade" }),
	tagId: text("tag_id")
		.notNull()
		.references(() => tagTable.id, { onDelete: "cascade" }),
	bookmarkId: text("bookmark_id")
		.notNull()
		.references(() => bookmarkTable.id, { onDelete: "cascade" }),
});
