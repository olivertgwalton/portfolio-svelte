import { expect, test } from '@playwright/test';

test.describe('desktop navigation', () => {
	test('all nav links go to the right pages', async ({ page }) => {
		await page.goto('/');
		const nav = page.locator('nav');

		await nav.getByRole('link', { name: 'Projects', exact: true }).click();
		await expect(page).toHaveURL(/\/projects$/);

		await nav.getByRole('link', { name: 'Blogs', exact: true }).click();
		await expect(page).toHaveURL(/\/blogs$/);

		await nav.getByRole('link', { name: 'About', exact: true }).click();
		await expect(page).toHaveURL(/\/about$/);

		await nav.getByRole('link', { name: 'Contact', exact: true }).click();
		await expect(page).toHaveURL(/\/contact$/);

		await nav.getByRole('link', { name: 'Oliver.' }).click();
		await expect(page).toHaveURL(/\/$/);
	});

	test('active link is marked with aria-current', async ({ page }) => {
		await page.goto('/about');
		const nav = page.locator('nav');
		await expect(nav.getByRole('link', { name: 'About', exact: true })).toHaveAttribute(
			'aria-current',
			'page'
		);
	});

	test('CV link opens the CV in a new tab', async ({ page }) => {
		await page.goto('/');
		const cvLink = page.getByRole('link', { name: 'CV' });
		await expect(cvLink).toHaveAttribute('target', '_blank');
		await expect(cvLink).toHaveAttribute('href', /oliver-walton-cv\.pdf/);
	});
});

test.describe('mobile navigation', () => {
	test.use({ viewport: { width: 390, height: 844 } });

	test('mobile menu opens and navigates', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('button', { name: 'Open Menu' }).click();
		await page.getByRole('menuitem', { name: 'Blogs' }).click();
		await expect(page).toHaveURL(/\/blogs$/);
	});
});

test.describe('404 handling', () => {
	test('unknown route shows the error page', async ({ page }) => {
		const response = await page.goto('/this-page-does-not-exist');
		expect(response?.status()).toBe(404);
		await expect(page.getByRole('heading', { name: '404' })).toBeVisible();
		await page.getByRole('link', { name: 'Go Home' }).click();
		await expect(page).toHaveURL(/\/$/);
	});

	test('unknown blogs slug shows the error page', async ({ page }) => {
		const response = await page.goto('/blogs/this-post-does-not-exist');
		expect(response?.status()).toBe(404);
		await expect(page.getByRole('heading', { name: '404' })).toBeVisible();
	});
});
