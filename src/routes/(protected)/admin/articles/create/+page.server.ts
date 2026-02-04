import { db } from '$lib/server/db';
import { posts } from '$lib/server/db/schema';
import { articleSchema } from '$lib/schemas/article';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const data = Object.fromEntries(formData);

		const result = articleSchema.safeParse(data);

		if (!result.success) {
			const { fieldErrors: errors } = result.error.flatten();
			return fail(400, { errors, data });
		}

		const { title, slug, excerpt, content, tags } = result.data;
		const coverImage = formData.get('cover_image') as string; // Handled separately or add to schema if string

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
			return fail(500, { message: 'Failed to create post. Slug might be taken.', data });
		}

		throw redirect(303, '/');
	}
} satisfies Actions;
