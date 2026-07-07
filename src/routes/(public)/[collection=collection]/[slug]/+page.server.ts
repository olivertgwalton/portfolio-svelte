import { getContentItem, getRelatedContent, type ContentType } from '$lib/content';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params }) => {
	const type: ContentType = params.collection === 'blogs' ? 'posts' : 'projects';
	const content = getContentItem(type, params.slug);

	if (!content) {
		error(404, `${type === 'posts' ? 'Post' : 'Project'} not found: ${params.slug}`);
	}

	const related = getRelatedContent(type, params.slug, content.tags ?? content.tech ?? []);

	return {
		meta: content,
		slug: params.slug,
		type,
		related
	};
};
