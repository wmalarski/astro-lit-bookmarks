import type { APIContext } from "astro";
import { paths } from "@utils/paths";

export const GET = async (context: APIContext): Promise<Response> => {
	console.log(context.url);

	return context.redirect(paths.index());
};

export const POST = async (context: APIContext): Promise<Response> => {
	console.log("POST", await context.request.formData());

	return context.redirect(paths.index());
};
