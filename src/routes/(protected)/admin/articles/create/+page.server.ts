import { db } from '$lib/server/db';
import { posts } from '$lib/server/db/schema';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
	default: async ({ request }) => {
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
			await db.insert(posts).values({
				title,
				slug,
				excerpt,
				content,
				cover_image: coverImage,
				tags,
				published_at: new Date()
			});
		} catch (e) {
			console.error('Error creating post:', e);
			return fail(500, { message: 'Failed to create post. Slug might be taken.' });
		}

		throw redirect(303, '/');
	}
} satisfies Actions;
