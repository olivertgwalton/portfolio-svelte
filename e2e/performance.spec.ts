import { test } from '@playwright/test';
import { playAudit } from 'playwright-lighthouse';

// Lighthouse attaches to the browser over CDP, so these only run in the
// `performance` project (chromium launched with --remote-debugging-port=9222).
const pages = [
	{ name: 'home', path: '/' },
	{ name: 'blog listing', path: '/blogs' },
	{ name: 'projects listing', path: '/projects' }
] as const;

for (const { name, path } of pages) {
	test(`${name} page meets performance budget`, async ({ page }) => {
		await page.goto(path);
		await playAudit({
			page,
			port: 9222,
			thresholds: {
				performance: 70,
				'best-practices': 80,
				seo: 80
			}
		});
	});
}
