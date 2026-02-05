import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	try {
		const post = await import(`../../../../lib/posts/${params.slug}.md`);

		return {
			content: post.default.render().html,
			meta: post.metadata
		};
	} catch (e) {
		throw error(404, `Post not found: ${params.slug}`);
	}
};
