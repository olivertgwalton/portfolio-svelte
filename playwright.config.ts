import { defineConfig, devices } from '@playwright/test';

declare const process: { env: Record<string, string | undefined> };

export default defineConfig({
	testDir: './e2e',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	reporter: 'html',
	use: {
		baseURL: 'http://localhost:4173',
		trace: 'on-first-retry'
	},
	expect: {
		toHaveScreenshot: {
			animations: 'disabled',
			maxDiffPixelRatio: 0.02
		}
	},
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
			testIgnore: /performance\.spec\.ts/
		},
		// Visual snapshots are pinned to chromium only — cross-browser pixel
		// diffs are noisy to maintain and functional coverage matters more here.
		{
			name: 'webkit',
			use: { ...devices['Desktop Safari'] },
			testIgnore: [/visual\.spec\.ts/, /performance\.spec\.ts/]
		},
		// Lighthouse audits attach over CDP, so this project needs its own
		// fixed debugging port and must run serially — scores get noisy if
		// other tests are hammering the same preview server concurrently.
		{
			name: 'performance',
			testMatch: /performance\.spec\.ts/,
			fullyParallel: false,
			// Lighthouse audits alone can take 20-30s per page on top of navigation.
			timeout: 90_000,
			use: {
				...devices['Desktop Chrome'],
				launchOptions: { args: ['--remote-debugging-port=9222'] }
			}
		}
	],
	webServer: {
		command: 'bun run build && bun run preview',
		url: 'http://localhost:4173',
		reuseExistingServer: !process.env.CI
	}
});
