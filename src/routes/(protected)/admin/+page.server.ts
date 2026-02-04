import { db } from '$lib/server/db';
import { posts } from '$lib/server/db/schema';
import { desc, eq } from 'drizzle-orm';
import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	try {
		const allPosts = await db
			.select({
				id: posts.id,
				title: posts.title,
				publishedAt: posts.published_at,
				slug: posts.slug
			})
			.from(posts)
			.orderBy(desc(posts.published_at));

		return {
			posts: allPosts
		};
	} catch (e) {
		console.error('Admin Dashboard Load Error:', e);
		return {
			posts: []
		};
	}
}) satisfies PageServerLoad;

export const actions = {
	deletePost: async ({ request }) => {
		const formData = await request.formData();
		const id = Number(formData.get('id'));

		if (!id) return fail(400, { message: 'Invalid ID' });

		try {
			await db.delete(posts).where(eq(posts.id, id));
			return { success: true };
		} catch (e) {
			console.error(e);
			return fail(500, { message: 'Failed to delete post' });
		}
	}
} satisfies Actions;
