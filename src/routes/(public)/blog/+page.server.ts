import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const posts = import.meta.glob('/src/lib/posts/*.md', { eager: true });

	const sortedPosts = Object.entries(posts)
		.map(([path, file]) => {
			const slug = path.split('/').pop()?.replace('.md', '');
			return {
				slug,
				...(file as { metadata: any }).metadata
			};
		})
		.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

	return {
		posts: sortedPosts
	};
};
