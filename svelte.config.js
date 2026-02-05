import adapter from '@sveltejs/adapter-vercel';
import { mdsvex } from 'mdsvex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md'],
	preprocess: [
		mdsvex({
			extensions: ['.md']
		})
	],
	kit: {
		adapter: adapter(),
		csp: {
			mode: 'auto',
			directives: {
				'default-src': ['self'],
				'script-src': ['self'],
				'style-src': ['self', 'unsafe-inline'],
				'style-src-attr': ['self', 'unsafe-inline'],
				'img-src': ['self', 'data:', 'https://cdn.bsky.app', 'https://picsum.photos'],
				'font-src': ['self', 'data:', 'https://cdn.jsdelivr.net'],
				'connect-src': [
					'self',
					'https://cdn.jsdelivr.net',
					// Allow dev server connections if running in dev
					process.env.NODE_ENV === 'development' ? 'http://localhost:5173' : '',
					process.env.NODE_ENV === 'development' ? 'ws://localhost:5173' : '',
					// Allow dynamic auth URL from env
					process.env.PUBLIC_BETTER_AUTH_URL
				].filter(Boolean),
				'object-src': ['none'],
				'base-uri': ['self']
			}
		}
	},

};

export default config;
