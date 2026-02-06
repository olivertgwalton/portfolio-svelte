import adapter from '@sveltejs/adapter-vercel';
import { mdsvex } from 'mdsvex';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md'],
	preprocess: [
		mdsvex({
			extensions: ['.md'],
			rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings]
		})
	],
	kit: {
		adapter: adapter(),
		csp: {
			mode: 'auto',
			directives: {
				'default-src': ['self'],
				'script-src': ['self', 'https://va.vercel-scripts.com'],
				'style-src': ['self', 'unsafe-inline'],
				'style-src-attr': ['self', 'unsafe-inline'],
				'img-src': ['self', 'data:', 'https://cdn.bsky.app', 'https://picsum.photos'],
				'font-src': ['self', 'data:', 'https://cdn.jsdelivr.net'],
				'connect-src': [
					'self',
					'https://cdn.jsdelivr.net',
					'https://va.vercel-scripts.com',
					'https://vitals.vercel-insights.com'
				].filter(Boolean),
				'object-src': ['none'],
				'base-uri': ['self']
			}
		}
	}
};

export default config;
