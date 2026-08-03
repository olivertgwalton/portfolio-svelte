import { getContentList, type Collection } from "#lib/content";
import type { PageServerLoad } from "./$types";

// The `as Collection` is load-bearing: SvelteKit's load-return type widens the
// literal union to string across the data boundary, so the annotation has to be
// reasserted here even though `params.collection` is already narrow.
export const load: PageServerLoad = ({ params }) => {
	const type: Collection = params.collection;
	const content = getContentList(type);
	return { content, type };
};
