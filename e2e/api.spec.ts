import { expect, test } from "@playwright/test";

test("sitemap.xml is well-formed and lists static pages", async ({
	request,
}) => {
	const response = await request.get("/sitemap.xml");
	expect(response.status()).toBe(200);
	// Exact type is now the static host's call (preview serves text/xml).
	expect(response.headers()["content-type"]).toMatch(/xml/);

	const body = await response.text();
	expect(body).toContain("<?xml");
	expect(body).toContain("<urlset");
	expect(body).toContain("<loc>https://oliverwalton.uk/</loc>");
	expect(body).toContain("<loc>https://oliverwalton.uk/blogs</loc>");
	expect(body).toContain("<loc>https://oliverwalton.uk/projects</loc>");
});

test("default og image is prerendered", async ({ request }) => {
	const response = await request.get("/og/default.png");
	expect(response.status()).toBe(200);
	expect(response.headers()["content-type"]).toMatch(/image\//);
});

test("each post has its own prerendered og image", async ({ request }) => {
	const response = await request.get("/og/blogs/distrohopping-journey.png");
	expect(response.status()).toBe(200);
	expect(response.headers()["content-type"]).toMatch(/image\//);
});
