import { auth } from '$lib/auth';
import type { Handle } from '@sveltejs/kit';
import { svelteKitHandler } from 'better-auth/svelte-kit';

export const handle: Handle = async ({ event, resolve }) => {
	const theme = event.cookies.get('theme') ?? 'cerberus';
	const mode = event.cookies.get('mode') ?? 'system';

	let htmlAttributes = `data-theme="${theme}"`;
	if (mode === 'dark') {
		htmlAttributes += ' class="dark"';
	}

	return svelteKitHandler({ event, resolve, auth }, async ({ event, resolve }) => {
		return await resolve(event, {
			transformPageChunk: ({ html }) =>
				html.replace('%sveltekit.html.attributes%', htmlAttributes)
		});
	});
};