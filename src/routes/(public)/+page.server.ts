import type { PageServerLoad } from './$types';
import { getContentList } from '$lib/content';

export const load: PageServerLoad = async () => {
	const posts = getContentList('posts').slice(0, 6);
	const projects = getContentList('projects').slice(0, 6);
	const experience = getContentList('experience');
	const education = getContentList('education');
	const certifications = getContentList('certifications');

	return {
		posts,
		projects,
		experience,
		education,
		certifications
	};
};
