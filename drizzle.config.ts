import { defineConfig } from "drizzle-kit";

export default defineConfig({
	schema: "./src/server/db.ts",
	dialect: "sqlite",
	dbCredentials: {
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		url: process.env.DB_URL!,
	},
	verbose: true,
	strict: true,
});
