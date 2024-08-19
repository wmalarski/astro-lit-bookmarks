import type { APIContext } from "astro";

export type ActionAPIContext = Omit<
  APIContext,
  "props" | "getActionResult" | "callAction"
>;
