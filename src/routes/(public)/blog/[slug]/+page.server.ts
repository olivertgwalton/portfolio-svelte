import { db } from '$lib/server/db';
import { posts } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import { marked } from 'marked';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
	const post = await db.query.posts.findFirst({
		where: eq(posts.slug, params.slug)
	});

	if (!post) {
		throw error(404, 'Post not found');
	}

	// Parse markdown to tokens (AST) for Svelte rendering
	const tokens = marked.lexer(post.content ?? '');

	return {
		post: {
			...post,
			tokens
		}
	};
}) satisfies PageServerLoad;
