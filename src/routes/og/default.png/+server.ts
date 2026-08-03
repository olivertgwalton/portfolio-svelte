import {
	OG_DEFAULT_DESCRIPTION,
	OG_DEFAULT_TITLE,
	renderOgImage,
} from "$lib/server/og";
import type { RequestHandler } from "./$types";

export const prerender = true;

export const GET: RequestHandler = () =>
	renderOgImage(OG_DEFAULT_TITLE, OG_DEFAULT_DESCRIPTION);
