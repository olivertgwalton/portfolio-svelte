import { getContentList, type Collection } from '$lib/content';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params }) => {
	const type = params.collection as Collection;
	const content = getContentList(type);
	return { content, type };
};
