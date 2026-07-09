import { expect, test } from '@playwright/test';

function attr(page: import('@playwright/test').Page, selector: string) {
	return page.locator(selector).getAttribute('content');
}

test.describe('basic meta tags on static pages', () => {
	const pages = [
		{ path: '/', title: /Oliver Walton/ },
		{ path: '/about', title: /About/ },
		{ path: '/contact', title: /Contact/ },
		{ path: '/blogs', title: /Blogs/ },
		{ path: '/projects', title: /Projects/ }
	] as const;

	for (const { path, title } of pages) {
		test(`${path === '/' ? 'home' : path} has a title and description`, async ({ page }) => {
			await page.goto(path);
			await expect(page).toHaveTitle(title);
			const description = await attr(page, 'meta[name="description"]');
			expect(description).toBeTruthy();
		});
	}
});

test.describe('open graph and twitter tags on content pages', () => {
	async function firstCollectionHref(
		page: import('@playwright/test').Page,
		path: '/blogs' | '/projects'
	) {
		await page.goto(path);
		const href = await page.locator(`a[href^="${path}/"]`).first().getAttribute('href');
		if (!href) throw new Error(`No cards found on ${path}`);
		return href;
	}

	test('blog post has complete OG and Twitter tags', async ({ page }) => {
		const href = await firstCollectionHref(page, '/blogs');
		await page.goto(href);

		await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'article');
		expect(await attr(page, 'meta[property="og:title"]')).toBeTruthy();
		expect(await attr(page, 'meta[property="og:description"]')).toBeTruthy();

		const ogUrl = await attr(page, 'meta[property="og:url"]');
		expect(ogUrl).toContain(href);

		const ogImage = await attr(page, 'meta[property="og:image"]');
		expect(ogImage).toMatch(/^https?:\/\//);

		expect(await attr(page, 'meta[name="twitter:card"]')).toBe('summary_large_image');
		expect(await attr(page, 'meta[name="twitter:title"]')).toBeTruthy();
		expect(await attr(page, 'meta[name="twitter:image"]')).toMatch(/^https?:\/\//);
	});

	test('project post has complete OG and Twitter tags', async ({ page }) => {
		const href = await firstCollectionHref(page, '/projects');
		await page.goto(href);

		await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'website');
		expect(await attr(page, 'meta[property="og:title"]')).toBeTruthy();
		expect(await attr(page, 'meta[property="og:image"]')).toMatch(/^https?:\/\//);
		expect(await attr(page, 'meta[name="twitter:card"]')).toBe('summary_large_image');
	});
});
