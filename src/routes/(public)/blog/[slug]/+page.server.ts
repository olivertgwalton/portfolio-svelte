import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

interface PostMeta {
	title: string;
	description: string;
	date: string;
	tags?: string[];
}

export const load: PageServerLoad = async ({ params }) => {
	const posts = import.meta.glob('/src/lib/posts/*.md', { eager: true });
	const path = `/src/lib/posts/${params.slug}.md`;
	const post = posts[path] as { metadata: PostMeta } | undefined;

	if (!post) {
		throw error(404, `Post not found: ${params.slug}`);
	}

	return {
		meta: post.metadata,
		slug: params.slug
	};
};
