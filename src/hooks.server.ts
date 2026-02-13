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

	return await resolve(event, {
		transformPageChunk: ({ html }) => {
			html = html.replace('%sveltekit.html.attributes%', htmlAttributes);
			if (!dev) {
				html = html.replace('</body>', `${CF_BEACON}</body>`);
			}
			return html;
		}
	});
};
