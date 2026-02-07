import type { PageServerLoad } from './$types';
import { getContentList } from '$lib/content';

export const load: PageServerLoad = async () => {
	const posts = getContentList('posts').slice(0, 3);
	const projects = getContentList('projects');
	const experience = getContentList('experience');
	const education = getContentList('education');

	return {
		posts,
		projects,
		experience,
		education
	};
};
