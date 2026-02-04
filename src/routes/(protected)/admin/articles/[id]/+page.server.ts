import { db } from '$lib/server/db';
import { posts } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ params }) => {
	const post = await db.query.posts.findFirst({
		where: eq(posts.id, Number(params.id))
	});

	if (!post) throw error(404, 'Post not found');

	return { post };
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request, params }) => {
		const formData = await request.formData();
		const title = formData.get('title') as string;
		const slug = formData.get('slug') as string;
		const excerpt = formData.get('excerpt') as string;
		const content = formData.get('content') as string;
		const coverImage = formData.get('cover_image') as string;
		const tags = formData.get('tags') as string;

		if (!title || !slug || !content) {
			return fail(400, { message: 'Missing required fields' });
		}

		try {
			await db
				.update(posts)
				.set({
					title,
					slug,
					excerpt,
					content,
					cover_image: coverImage,
					tags
				})
				.where(eq(posts.id, Number(params.id)));
		} catch (e) {
			console.error('Error updating post:', e);
			return fail(500, { message: 'Failed to update post. Slug might be taken.' });
		}

		throw redirect(303, '/admin');
	}
} satisfies Actions;
