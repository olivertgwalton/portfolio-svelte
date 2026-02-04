import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '$lib/server/db'; // Ensure this exports your Drizzle instance
import * as schema from '$lib/server/db/schema'; // Ensure this points to your schema file

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'sqlite', // or "pg", "mysql"
		schema: schema
	}),
	emailAndPassword: {
		enabled: true
	}
});
