import { browser } from '$app/environment';

class Theme {
	isDark = $state(false);

	constructor() {
		if (browser) {
			const saved = localStorage.getItem('theme');
			const system = window.matchMedia('(prefers-color-scheme: dark)').matches;
			this.isDark = saved === 'dark' || (!saved && system);
			this.#updateDom();
		}
	}

	#updateDom() {
		if (!browser) return;
		if (this.isDark) {
			document.documentElement.classList.add('dark');
			localStorage.setItem('theme', 'dark');
		} else {
			document.documentElement.classList.remove('dark');
			localStorage.setItem('theme', 'light');
		}
	}

	toggle(event?: MouseEvent | { clientX: number; clientY: number }) {
		if (!browser) return;

		// Fallback if View Transitions API is not supported or no event provided
		if (!document.startViewTransition || !event) {
			this.isDark = !this.isDark;
			this.#updateDom();
			return;
		}

		const x = event.clientX;
		const y = event.clientY;
		const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

		// Set CSS variables for the transition
		document.documentElement.style.setProperty('--x', `${x}px`);
		document.documentElement.style.setProperty('--y', `${y}px`);
		document.documentElement.style.setProperty('--r', `${endRadius}px`);

		// Execute the transition
		document.startViewTransition(async () => {
			this.isDark = !this.isDark;
			this.#updateDom();
			// Wait for the next tick to ensure DOM updates are painted
			await new Promise((resolve) => setTimeout(resolve, 0));
		});
	}
}

export const theme = new Theme();
