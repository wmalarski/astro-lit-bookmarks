import { createContext } from "@lit/context";
import type { createRestAPIClient } from "masto";

export type MastoContextValue = {
	mastoClient: ReturnType<typeof createRestAPIClient>;
};

export const mastoContext = createContext<MastoContextValue>("masto");
