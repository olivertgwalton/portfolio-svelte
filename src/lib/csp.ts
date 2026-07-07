import type { Config } from '@sveltejs/kit';

export const cspDirectives: NonNullable<NonNullable<Config['kit']>['csp']>['directives'] = {
	'default-src': ['self'],
	'script-src': ['self', 'blob:', 'wasm-unsafe-eval', 'https://static.cloudflareinsights.com'],
	'worker-src': ['self', 'blob:'],
	'style-src': ['self', 'unsafe-inline'],
	'style-src-attr': ['self', 'unsafe-inline'],
	'img-src': ['self', 'data:', 'https://cdn.bsky.app', 'https://picsum.photos'],
	'font-src': ['self', 'data:', 'https://cdn.jsdelivr.net'],
	'connect-src': ['self', 'https://cdn.jsdelivr.net', 'https://cloudflareinsights.com'],
	'object-src': ['none'],
	'base-uri': ['self']
};
