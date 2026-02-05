import { json } from '@sveltejs/kit';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const data = await request.formData();
	const file = data.get('image') as File;

	if (!file) {
		return json({ error: 'No file uploaded' }, { status: 400 });
	}

	// Create a unique filename to prevent overwrites
	const buffer = await file.arrayBuffer();
	const uniqueName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '-')}`;

	// Use env var for upload dir or default to 'uploads' (relative to CWD)
	// In Docker, CWD is /app. We might want to write to /app/uploads (mounted volume)
	// and serve it via a static file server or SvelteKit logic?
	// SvelteKit adapter-bun serves 'build/client' as static assets.
	// Writing to 'static/uploads' in dev works because Vite serves it.
	// In prod (Docker), 'static' is gone, content is in 'build/client'.
	// BUT we shouldn't write to 'build/client' at runtime ideally.
	// Best practice: Write to a persistent volume (e.g. /app/uploads) and use a symlink or
	// serve that directory using a custom server handler.
	// HOWEVER, for simplicity with adapter-bun:
	// We can write to 'build/client/uploads' IF we mount the volume there.

	// Let's use a simpler approach: define a storage path.
	const uploadDir = process.env.UPLOAD_DIR || 'static/uploads';
	// Ensure directory exists?
	// User needs to ensure the path exists or we mkdir it.

	const path = join(process.cwd(), uploadDir, uniqueName);

	try {
		writeFileSync(path, Buffer.from(buffer));
		return json({ url: `/uploads/${uniqueName}` });
	} catch (e) {
		console.error('Upload error:', e);
		return json({ error: 'Failed to save file' }, { status: 500 });
	}
};
