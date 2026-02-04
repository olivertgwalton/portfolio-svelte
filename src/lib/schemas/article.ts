import { z } from 'zod';

export const articleSchema = z.object({
	title: z.string().min(1, 'Title is required').max(100),
	slug: z
		.string()
		.min(1, 'Slug is required')
		.regex(/^[a-z0-9-]+$/, 'Slug must be lowercase, numbers, and hyphens only'),
	excerpt: z.string().max(300).optional(),
	content: z.string().min(1, 'Content is required'),
	tags: z.string().regex(/^([a-z0-9-]+,\s*)*[a-z0-9-]+$/, 'Tags must be comma-separated'),
	published_at: z.string().datetime().optional().nullable()
});

export type ArticleSchema = z.infer<typeof articleSchema>;
