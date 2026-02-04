import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	age: integer('age')
});

export const posts = sqliteTable('posts', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	title: text('title').notNull(),
	slug: text('slug').notNull().unique(),
	excerpt: text('excerpt'),
	content: text('content'),
	cover_image: text('cover_image'),
	tags: text('tags'),
	published_at: integer('published_at', { mode: 'timestamp' })
});
