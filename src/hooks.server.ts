import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const theme = event.cookies.get('theme') ?? 'modern';
	const mode = event.cookies.get('mode') ?? 'system';

	let htmlAttributes = `data-theme="${theme}"`;
	if (mode === 'dark') {
		htmlAttributes += ' class="dark"';
	}

	return await resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%sveltekit.html.attributes%', htmlAttributes)
	});
};
