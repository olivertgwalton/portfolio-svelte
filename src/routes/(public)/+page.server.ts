import type { PageServerLoad } from './$types';
import { getContentList } from '$lib/content';

export const load: PageServerLoad = () => {
	const blogs = getContentList('blogs').slice(0, 6);
	const projects = getContentList('projects').slice(0, 6);
	const experience = getContentList('experience');
	const education = getContentList('education');
	const certifications = getContentList('certifications');

	return {
		blogs,
		projects,
		experience,
		education,
		certifications
	};
};
