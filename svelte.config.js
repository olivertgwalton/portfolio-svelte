import adapter from 'svelte-adapter-bun';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// adapter-bun handles Bun runtime environments perfectly
		adapter: adapter(),
		csp: {
			mode: 'auto',
			directives: {
				'default-src': ['self'],
				'script-src': ['self'],
				// SvelteKit and many UI libraries rely heavily on inline styles (animations, etc).
				// 'unsafe-inline' for style-src is often required unless using strict hash-based policies for every style block.
				'style-src': ['self', 'unsafe-inline'],
				'style-src-attr': ['self', 'unsafe-inline'],
				'img-src': ['self', 'data:', 'https://cdn.bsky.app', 'https://picsum.photos'],
				'font-src': ['self', 'data:', 'https://cdn.jsdelivr.net'],
				// connect-src needs to allow the auth server. In dev it's localhost:5173.
				// In prod it will be 'self' (if same origin) or the specific domain.
				// We add localhost explicitly for dev.
				                				'connect-src': [
				                					'self',
				                					'https://cdn.jsdelivr.net',
				                					// Allow dev server connections if running in dev
				                					process.env.NODE_ENV === 'development' ? 'http://localhost:5173' : '',
				                					process.env.NODE_ENV === 'development' ? 'ws://localhost:5173' : '',
				                					// Allow dynamic auth URL from env
				                					process.env.PUBLIC_BETTER_AUTH_URL
				                				].filter(Boolean),				'object-src': ['none'],
				'base-uri': ['self']
			}
		}
	},
	vite: {
		build: {
			rollupOptions: {
				external: ['bun:sqlite']
			}
		},
		ssr: {
			external: ['bun:sqlite']
		}
	}
};

export default config;
