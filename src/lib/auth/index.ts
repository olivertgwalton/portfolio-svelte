import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '$lib/server/db'; // Ensure this exports your Drizzle instance
import * as schema from '$lib/server/db/schema'; // Ensure this points to your schema file
import { env } from '$env/dynamic/private';

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'sqlite', // or "pg", "mysql"
		schema: schema
	}),
	emailAndPassword: {
		enabled: true
	},
	rateLimit: {
		window: 60, // time window in seconds
		max: 100 // max requests per window
	},
	secret: env.BETTER_AUTH_SECRET,
	advanced: {
		useSecureCookies: true,
		cookiePrefix: 'oliverwalton'
	},
	baseURL: env.BETTER_AUTH_URL,
	// Ensure trustedOrigins includes both localhost (dev) and the production domain from env
	trustedOrigins: [
		'http://localhost:5173',
		...(env.BETTER_AUTH_TRUSTED_ORIGINS ? env.BETTER_AUTH_TRUSTED_ORIGINS.split(',') : [])
	]
});
