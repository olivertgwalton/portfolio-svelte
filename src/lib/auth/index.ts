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
		window: 60,
		max: 100
	},
	secret: env.BETTER_AUTH_SECRET,
	baseURL: env.BETTER_AUTH_URL,
	trustedOrigins: ['http://localhost:5173', 'http://localhost:3000', ...(env.BETTER_AUTH_TRUSTED_ORIGINS?.split(',') ?? [])]
});
