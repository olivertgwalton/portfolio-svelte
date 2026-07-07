import { expect, test } from '@playwright/test';

test('homepage loads', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('nav')).toBeVisible();
});

test('about page loads', async ({ page }) => {
	await page.goto('/about');
	await expect(page).toHaveTitle(/About/);
});

test('contact page loads', async ({ page }) => {
	await page.goto('/contact');
	await expect(page).toHaveTitle(/Contact/);
});

test('navbar links to about and contact', async ({ page }) => {
	await page.goto('/');
	await page.getByRole('link', { name: 'About', exact: true }).click();
	await expect(page).toHaveURL(/\/about$/);
});
