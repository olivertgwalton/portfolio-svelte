import type { PageServerLoad } from './$types';
import { getContentList } from '$lib/content';
import { getGitHubData } from '$lib/github';

export const load: PageServerLoad = async () => {
	const [posts, projects, experience, education, github] = await Promise.all([
		Promise.resolve(getContentList('posts').slice(0, 6)),
		Promise.resolve(getContentList('projects').slice(0, 6)),
		Promise.resolve(getContentList('experience')),
		Promise.resolve(getContentList('education')),
		getGitHubData('olivertgwalton')
	]);

	return {
		posts,
		projects,
		experience,
		education,
		github
	};
};
