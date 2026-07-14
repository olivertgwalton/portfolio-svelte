import {
	getAdjacentContent,
	getContentItem,
	getRelatedContent,
	type Collection
} from '$lib/content';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params }) => {
	const type = params.collection as Collection;
	const content = getContentItem(type, params.slug);

	if (!content) {
		error(404, `${type === 'blogs' ? 'Blog' : 'Project'} not found: ${params.slug}`);
	}

	const related = getRelatedContent(type, params.slug, content.tags ?? content.tech ?? []);
	const adjacent = getAdjacentContent(type, params.slug);

	return {
		meta: content,
		slug: params.slug,
		type,
		related,
		adjacent
	};
};
