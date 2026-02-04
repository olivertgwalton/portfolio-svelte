import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const theme = event.cookies.get('theme') ?? 'cerberus';
	const allowedThemes = ['cerberus', 'rose', 'nosh', 'mona', 'sahara', 't3-chat'];
	const validTheme = allowedThemes.includes(theme) ? theme : 'cerberus';
	const mode = event.cookies.get('mode') ?? 'system';

	let htmlAttributes = `data-theme="${validTheme}"`;
	if (mode === 'dark') {
		htmlAttributes += ' class="dark"';
	}

	return await resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%sveltekit.html.attributes%', htmlAttributes)
	});
};
