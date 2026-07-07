import { expect, type Page, test } from '@playwright/test';

const collections = [
	{ path: '/blogs', title: /Blogs/, heading: 'Blogs.' },
	{ path: '/projects', title: /Projects/, heading: 'Projects.' }
] as const;

function firstCardLink(page: Page, path: string) {
	return page.locator(`a[href^="${path}/"]`).first();
}

for (const collection of collections) {
	test.describe(`${collection.path} listing`, () => {
		test('loads with a heading and at least one card', async ({ page }) => {
			await page.goto(collection.path);
			await expect(page).toHaveTitle(collection.title);
			await expect(page.getByRole('heading', { name: collection.heading })).toBeVisible();
			await expect(firstCardLink(page, collection.path)).toBeVisible();
		});

		test('search filters the list', async ({ page }) => {
			await page.goto(collection.path);
			const search = page.getByPlaceholder(/Search/);
			const initialCount = await page.locator(`a[href^="${collection.path}/"]`).count();
			expect(initialCount).toBeGreaterThan(0);

			await search.fill('zzz-no-such-content-zzz');
			await expect(page.getByText('Nothing found.')).toBeVisible();
			await expect(page.locator(`a[href^="${collection.path}/"]`)).toHaveCount(0);

			await search.fill('');
			await expect(page.locator(`a[href^="${collection.path}/"]`)).toHaveCount(initialCount);
		});

		test('clicking a card opens the detail page and back link returns', async ({ page }) => {
			await page.goto(collection.path);
			const link = firstCardLink(page, collection.path);
			const href = await link.getAttribute('href');
			await link.click();
			await expect(page).toHaveURL(new RegExp(`${href}$`));

			await page.getByRole('link', { name: /BACK/i }).click();
			await expect(page).toHaveURL(new RegExp(`${collection.path}$`));
		});
	});
}
