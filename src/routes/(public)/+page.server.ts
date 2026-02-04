import { db } from '$lib/server/db';
import { posts } from '$lib/server/db/schema';
import { desc } from 'drizzle-orm';

async function getPosts() {
	try {
		return await db
			.select({
				id: posts.id,
				title: posts.title,
				slug: posts.slug,
				excerpt: posts.excerpt,
				publishedAt: posts.published_at
			})
			.from(posts)
			.orderBy(desc(posts.published_at))
			.limit(3);
	} catch (e) {
		console.error('Posts Load Error:', e);
		return [];
	}
}

export const load = async () => {
	return {
		posts: getPosts()
	};
};
