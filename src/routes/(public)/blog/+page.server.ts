import { db } from '$lib/server/db';
import { posts } from '$lib/server/db/schema';
import { desc, like, and } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const search = url.searchParams.get('q') || '';
	const tag = url.searchParams.get('tag') || '';

	const conditions = [];
	if (search) conditions.push(like(posts.title, `%${search}%`));
	if (tag) conditions.push(like(posts.tags, `%${tag}%`));

	const allPosts = await db
		.select({
			id: posts.id,
			title: posts.title,
			slug: posts.slug,
			excerpt: posts.excerpt,
			publishedAt: posts.published_at,
			tags: posts.tags
		})
		.from(posts)
		.where(conditions.length > 0 ? and(...conditions) : undefined)
		.orderBy(desc(posts.published_at));

	// Get all unique tags for filter
	const allTagsQuery = await db.select({ tags: posts.tags }).from(posts);
	const uniqueTags = new Set<string>();
	allTagsQuery.forEach((p) => {
		if (p.tags) {
			p.tags
				.split(',')
				.map((t) => t.trim())
				.forEach((t) => {
					if (t) uniqueTags.add(t);
				});
		}
	});

	return {
		posts: allPosts,
		search,
		currentTag: tag,
		tags: Array.from(uniqueTags).sort()
	};
};
