import { getContentList, type ContentType } from '$lib/content';
import type { PageServerLoad } from './$types';

export const config = {
	isr: {
		expiration: 3600
	}
};

export const load: PageServerLoad = ({ params }) => {
	const type: ContentType = params.collection === 'blogs' ? 'posts' : 'projects';
	const content = getContentList(type);
	return { content, type };
};
