import { getContentList, type ContentType } from '$lib/content';
import type { PageServerLoad } from './$types';

export const config = {
	isr: {
		expiration: 3600
	}
};

export const load: PageServerLoad = async ({ params }) => {
	const type: ContentType = params.collection === 'blog' ? 'posts' : 'projects';
	const content = getContentList(type);
	return { content, type };
};
