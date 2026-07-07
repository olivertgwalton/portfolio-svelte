import { expect, test } from '@playwright/test';

test('sitemap.xml is well-formed and lists static pages', async ({ request }) => {
	const response = await request.get('/sitemap.xml');
	expect(response.status()).toBe(200);
	expect(response.headers()['content-type']).toContain('application/xml');

	const body = await response.text();
	expect(body).toContain('<?xml');
	expect(body).toContain('<urlset');
	expect(body).toContain('<loc>https://oliverwalton.uk/</loc>');
	expect(body).toContain('<loc>https://oliverwalton.uk/blogs</loc>');
	expect(body).toContain('<loc>https://oliverwalton.uk/projects</loc>');
});

test('og image endpoint returns an image', async ({ request }) => {
	const response = await request.get('/api/og?title=Test%20Title&description=Test%20description');
	expect(response.status()).toBe(200);
	expect(response.headers()['content-type']).toMatch(/image\//);
});
