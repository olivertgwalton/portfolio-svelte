import { building } from '$app/environment';
import { auth } from '$lib/auth';
import type { Handle, RequestEvent, ResolveOptions } from '@sveltejs/kit';
import { svelteKitHandler } from 'better-auth/svelte-kit';

export const handle: Handle = async ({ event, resolve }) => {
	const theme = event.cookies.get('theme') ?? 'modern';
	const mode = event.cookies.get('mode') ?? 'system';

	let htmlAttributes = `data-theme="${theme}"`;
	if (mode === 'dark') {
		htmlAttributes += ' class="dark"';
	}

	return svelteKitHandler({
		event,
		resolve: async (event: RequestEvent, opts?: ResolveOptions) => {
			return resolve(event, {
				...opts,
				transformPageChunk: ({ html }) =>
					html.replace('%sveltekit.html.attributes%', htmlAttributes)
			});
		},
		auth,
		building
	});
};
