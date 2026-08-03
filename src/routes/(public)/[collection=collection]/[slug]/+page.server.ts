import {
	type Collection,
	getAdjacentContent,
	getContentItem,
	getRelatedContent,
} from "#lib/content";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

// Annotated rather than cast: SvelteKit's load-return type widens the literal
// union to string across the data boundary, so it has to be reasserted — but an
// annotation is checked, where `as Collection` would just be asserted.
export const load: PageServerLoad = ({ params }) => {
	const type: Collection = params.collection;
	const content = getContentItem(type, params.slug);

	if (!content) {
		error(
			404,
			`${type === "blogs" ? "Blog" : "Project"} not found: ${params.slug}`,
		);
	}

	const related = getRelatedContent(
		type,
		params.slug,
		content.tags ?? content.tech ?? [],
	);
	const adjacent = getAdjacentContent(type, params.slug);

	return {
		meta: content,
		slug: params.slug,
		type,
		related,
		adjacent,
	};
};
