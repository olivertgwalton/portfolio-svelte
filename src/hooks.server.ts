import { dev } from '$app/environment';
import type { Handle } from '@sveltejs/kit';

const CF_BEACON = `<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token":"5a5e3c2aba8b40ab9dfd68cba95e3705"}'></script>`;

export const handle: Handle = async ({ event, resolve }) => {
	const theme = event.cookies.get('theme') ?? 'modern';
	const mode = event.cookies.get('mode') ?? 'system';

	let htmlAttributes = `data-theme="${theme}"`;
	if (mode === 'dark') {
		htmlAttributes += ' class="dark"';
	}

	const response = await resolve(event, {
		transformPageChunk: ({ html }) => {
			html = html.replace('%sveltekit.html.attributes%', htmlAttributes);
			if (!dev) {
				html = html.replace('</body>', `${CF_BEACON}</body>`);
			}
			return html;
		}
	});

	// Set cache headers for pages (static assets are handled by the adapter)
	const path = event.url.pathname;
	if (!response.headers.has('cache-control')) {
		if (path.startsWith('/api/')) {
			response.headers.set('Cache-Control', 'public, max-age=600');
		} else {
			// HTML pages: private cache (content varies by theme/mode cookies)
			response.headers.set('Cache-Control', 'private, max-age=3600, must-revalidate');
		}
	}

	return response;
};
