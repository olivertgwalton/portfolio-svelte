import { error } from "@sveltejs/kit";
import type { Collection } from "$lib/content";
import { getContentItem, getContentList } from "$lib/content";
import { renderOgImage } from "$lib/server/og";
import type { EntryGenerator, RequestHandler } from "./$types";

export const prerender = true;

// Search params can't be prerendered, so each post gets its own baked image.
export const entries: EntryGenerator = () =>
	(["blogs", "projects"] as const).flatMap((collection) =>
		getContentList(collection).map(({ slug }) => ({ collection, slug })),
	);

export const GET: RequestHandler = ({ params }) => {
	const item = getContentItem(params.collection as Collection, params.slug);
	if (!item) error(404, `No content at ${params.collection}/${params.slug}`);
	return renderOgImage(item.title, item.description);
};
