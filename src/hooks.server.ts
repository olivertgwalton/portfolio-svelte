import { building } from '$app/environment';
import { auth } from '$lib/auth';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { count } from 'drizzle-orm';
import type { Handle } from '@sveltejs/kit';
import { svelteKitHandler } from 'better-auth/svelte-kit';

export const handle: Handle = async ({ event, resolve }) => {
	// Block signups if any user exists
	if (event.url.pathname.includes('/api/auth/sign-up')) {
		const [result] = await db.select({ count: count() }).from(user);
		if (result.count > 0) {
			return new Response('Registration disabled.', { status: 403 });
		}
	}

	const theme = event.cookies.get('theme') ?? 'modern';
	const mode = event.cookies.get('mode') ?? 'system';

	let htmlAttributes = `data-theme="${theme}"`;
	if (mode === 'dark') {
		htmlAttributes += ' class="dark"';
	}

	return svelteKitHandler({
		event,
		resolve: async (event) => {
			return resolve(event, {
				transformPageChunk: ({ html }) =>
					html.replace('%sveltekit.html.attributes%', htmlAttributes)
			});
		},
		auth
	});
};
