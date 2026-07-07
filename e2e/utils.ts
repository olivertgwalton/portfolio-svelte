import type { Page } from '@playwright/test';

// The `reveal` action fades sections in on scroll via inline styles + Web
// Animations, independent of any CSS transition/animation Playwright can
// freeze. Force everything visible so scans and screenshots are deterministic
// regardless of whether the IntersectionObserver has fired yet.
export async function settleAnimations(page: Page) {
	await page.waitForLoadState('networkidle');
	await page.evaluate(() => {
		for (const el of document.querySelectorAll<HTMLElement>('*')) {
			for (const anim of el.getAnimations()) {
				try {
					anim.finish();
				} catch {
					// Infinite animations (e.g. animate-pulse) can't be finished; leave them running.
				}
			}
			if (el.style.opacity === '0') {
				el.style.transition = 'none';
				el.style.opacity = '1';
				el.style.transform = 'none';
			}
		}
	});
}
