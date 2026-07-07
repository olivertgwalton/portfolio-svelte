import { expect, test } from '@playwright/test';
import { settleAnimations } from './utils';

const pages = [
	{ name: 'home', path: '/' },
	{ name: 'about', path: '/about' },
	{ name: 'contact', path: '/contact' },
	{ name: 'blogs-listing', path: '/blogs' },
	{ name: 'projects-listing', path: '/projects' }
] as const;

for (const { name, path } of pages) {
	test(`${name} page matches its light mode snapshot`, async ({ page }) => {
		await page.goto(path);
		await settleAnimations(page);
		await expect(page).toHaveScreenshot(`${name}-light.png`, {
			fullPage: true
		});
	});

	test(`${name} page matches its dark mode snapshot`, async ({ page }) => {
		await page.goto(path);
		await page.evaluate(() => {
			document.cookie = 'mode=dark; path=/';
		});
		await page.reload();
		await settleAnimations(page);
		await expect(page).toHaveScreenshot(`${name}-dark.png`, {
			fullPage: true
		});
	});
}

test('navbar matches its snapshot on mobile', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/');
	await settleAnimations(page);
	await expect(page.locator('nav')).toHaveScreenshot('navbar-mobile.png');
});
