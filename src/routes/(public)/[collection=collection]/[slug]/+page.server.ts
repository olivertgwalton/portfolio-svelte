import { getContentItem, getRelatedContent, type ContentType } from '$lib/content';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const config = {
	isr: {
		expiration: 3600
	}
};

export const load: PageServerLoad = async ({ params }) => {
	const type: ContentType = params.collection === 'blog' ? 'posts' : 'projects';
	const content = getContentItem(type, params.slug);

	if (!content) {
		throw error(404, `${type === 'posts' ? 'Post' : 'Project'} not found: ${params.slug}`);
	}

	const related = getRelatedContent(type, params.slug, content.tags ?? content.tech ?? []);

	return {
		meta: content,
		slug: params.slug,
		type,
		related
	};
};
