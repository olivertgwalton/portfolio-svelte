import AxeBuilder from '@axe-core/playwright';
import { expect, type Page, test } from '@playwright/test';
import { settleAnimations } from './utils';

const pages = [
	{ name: 'home', path: '/' },
	{ name: 'about', path: '/about' },
	{ name: 'contact', path: '/contact' },
	{ name: 'blog listing', path: '/blogs' },
	{ name: 'projects listing', path: '/projects' }
] as const;

async function firstCollectionPost(page: Page, path: '/blogs' | '/projects') {
	await page.goto(path);
	const href = await page.locator(`a[href^="${path}/"]`).first().getAttribute('href');
	if (!href) throw new Error(`No cards found on ${path}`);
	return href;
}

async function scan(page: Page) {
	await settleAnimations(page);
	return new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
}

for (const { name, path } of pages) {
	test(`${name} page has no automatically detectable accessibility issues`, async ({ page }) => {
		await page.goto(path);
		const results = await scan(page);
		expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
	});
}

test('blog post page has no automatically detectable accessibility issues', async ({ page }) => {
	const href = await firstCollectionPost(page, '/blogs');
	await page.goto(href);
	const results = await scan(page);
	expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
});

test('project post page has no automatically detectable accessibility issues', async ({ page }) => {
	const href = await firstCollectionPost(page, '/projects');
	await page.goto(href);
	const results = await scan(page);
	expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
});

test('dark mode has no automatically detectable accessibility issues', async ({ page }) => {
	await page.goto('/');
	await page.getByRole('button', { name: 'Appearance' }).click();
	await page.getByRole('menuitem', { name: 'Dark' }).click();
	await page.keyboard.press('Escape');

	const results = await scan(page);
	expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
});
