import type { PageServerLoad } from './$types';

interface Post {
	slug: string;
	title: string;
	description: string;
	date: string;
	tags?: string[];
}

export const load: PageServerLoad = async () => {
	const posts = import.meta.glob('/src/lib/posts/*.md', { eager: true });

	const sortedPosts = Object.entries(posts)
		.map(([path, file]) => {
			const slug = path.split('/').pop()?.replace('.md', '') || '';
			const metadata = (file as { metadata: Omit<Post, 'slug'> }).metadata;
			return {
				slug,
				...metadata
			};
		})
		.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

	return {
		posts: sortedPosts as Post[]
	};
};
