import { type Page, expect, test } from "@playwright/test";

function attr(page: Page, selector: string) {
	return page.locator(selector).getAttribute("content");
}

test.describe("basic meta tags on static pages", () => {
	const pages = [
		{ path: "/", title: /Oliver Walton/ },
		{ path: "/about", title: /About/ },
		{ path: "/contact", title: /Contact/ },
		{ path: "/blogs", title: /Blogs/ },
		{ path: "/projects", title: /Projects/ },
	] as const;

	for (const { path, title } of pages) {
		test(`${path === "/" ? "home" : path} has a title and description`, async ({
			page,
		}) => {
			await page.goto(path);
			await expect(page).toHaveTitle(title);
			const description = await attr(page, 'meta[name="description"]');
			expect(description).toBeTruthy();
		});
	}
});

test.describe("open graph and twitter tags on content pages", () => {
	async function firstCollectionHref(page: Page, path: "/blogs" | "/projects") {
		await page.goto(path);
		const href = await page
			.locator(`a[href^="${path}/"]`)
			.first()
			.getAttribute("href");
		if (!href) throw new Error(`No cards found on ${path}`);
		return href;
	}

	// Blogs are articles, projects are websites; every other tag is asserted
	// identically for both.
	const collections = [
		{ path: "/blogs", ogType: "article" },
		{ path: "/projects", ogType: "website" },
	] as const;

	for (const { path, ogType } of collections) {
		test(`${path} post has complete OG and Twitter tags`, async ({ page }) => {
			const href = await firstCollectionHref(page, path);
			await page.goto(href);

			await expect(page.locator('meta[property="og:type"]')).toHaveAttribute(
				"content",
				ogType,
			);
			expect(await attr(page, 'meta[property="og:title"]')).toBeTruthy();
			expect(await attr(page, 'meta[property="og:description"]')).toBeTruthy();
			expect(await attr(page, 'meta[property="og:url"]')).toContain(href);
			expect(await attr(page, 'meta[property="og:image"]')).toMatch(
				/^https?:\/\//,
			);

			expect(await attr(page, 'meta[name="twitter:card"]')).toBe(
				"summary_large_image",
			);
			expect(await attr(page, 'meta[name="twitter:title"]')).toBeTruthy();
			expect(await attr(page, 'meta[name="twitter:image"]')).toMatch(
				/^https?:\/\//,
			);
		});
	}
});
