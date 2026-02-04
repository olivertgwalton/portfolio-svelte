import { json } from '@sveltejs/kit';
import { writeFileSync } from 'fs';
import { join } from 'path';
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
	const path = join(process.cwd(), 'static', 'uploads', uniqueName);

	try {
		writeFileSync(path, Buffer.from(buffer));
		return json({ url: `/uploads/${uniqueName}` });
	} catch (e) {
		console.error('Upload error:', e);
		return json({ error: 'Failed to save file' }, { status: 500 });
	}
};
