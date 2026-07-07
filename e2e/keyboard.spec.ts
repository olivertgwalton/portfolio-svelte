import { expect, test } from '@playwright/test';

test.describe('keyboard navigation', () => {
	test('tab order reaches every desktop nav link', async ({ page, browserName }) => {
		// WebKit doesn't put <a> elements in the tab order by default — this
		// matches real Safari's default behavior without "Full Keyboard
		// Access" enabled, not a site bug.
		test.skip(browserName === 'webkit', 'WebKit excludes links from the tab order by default');

		await page.goto('/');
		await page.waitForLoadState('networkidle');
		const nav = page.locator('nav');
		const labels = ['Oliver.', 'Home', 'Projects', 'Blogs', 'About', 'Contact'];

		for (const label of labels) {
			await page.keyboard.press('Tab');
			await expect(nav.getByRole('link', { name: label, exact: true })).toBeFocused();
		}
	});

	test('appearance menu items are reachable via arrow keys and activate with Enter', async ({
		page
	}) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');
		const trigger = page.getByRole('button', { name: 'Appearance' });
		await trigger.focus();
		await page.keyboard.press('Enter');
		await page.keyboard.press('ArrowDown');
		await page.keyboard.press('Enter');

		await expect(page.locator('html')).toHaveAttribute('data-theme', /.+/);
	});

	test('mobile menu opens and closes with the keyboard', async ({ page }) => {
		await page.setViewportSize({ width: 390, height: 844 });
		await page.goto('/');
		await page.waitForLoadState('networkidle');
		const trigger = page.getByRole('button', { name: 'Open Menu' });
		await trigger.focus();
		await page.keyboard.press('Enter');

		const blogItem = page.getByRole('menuitem', { name: 'Blogs' });
		await expect(blogItem).toBeVisible();

		await page.keyboard.press('Escape');
		await expect(blogItem).toBeHidden();
		await expect(trigger).toBeFocused();
	});

	test('table of contents links are keyboard activatable', async ({ page }) => {
		await page.goto('/blogs');
		const href = await page.locator('a[href^="/blogs/"]').first().getAttribute('href');
		if (!href) throw new Error('No blogs posts found');
		await page.goto(href);

		// ContentPost renders the TOC twice: a mobile copy inside a closed
		// <details> (unfocusable until opened) and the desktop sidebar copy.
		// Target only the visible one. Headings populate asynchronously (the
		// markdown body loads via dynamic import, then a MutationObserver
		// fills in the TOC), so wait for it rather than a one-shot count().
		const tocLinks = page.locator('a[href^="#"]:visible');
		const tocLink = tocLinks.first();
		const hasToc = await tocLink
			.waitFor({ state: 'visible', timeout: 10000 })
			.then(() => true)
			.catch(() => false);
		test.skip(!hasToc, 'post has no table of contents');

		await tocLink.focus();
		await expect(tocLink).toBeFocused();
		await page.keyboard.press('Enter');
		await expect(page).toHaveURL(/#/);
	});
});
