import { auth } from '$lib/auth';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { count } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const [result] = await db.select({ count: count() }).from(user);
	if (result.count > 0) return new Response('Setup locked. User already exists.', { status: 403 });

	const email = url.searchParams.get('email');
	const password = url.searchParams.get('password');
	const name = url.searchParams.get('name') || 'Oliver Walton';

	if (!email || !password) {
		return new Response('Provide ?email=...&password=... in the URL', { status: 400 });
	}

	try {
		auth.api.signUpEmail({
			body: { email, password, name }
		});
		return new Response(`SUCCESS: Account created for ${email}.\n\nDELETE THIS FILE IMMEDIATELY: src/routes/api/setup/+server.ts`);
	} catch (e) {
		return new Response(`Error: ${(e as Error).message}`, { status: 500 });
	}
};

