import { getContext, setContext, tick } from 'svelte';

const THEME_KEY = Symbol('theme');

export const themes = [
	{ id: 'modern', name: 'Modern' },
	{ id: 'cerberus', name: 'Cerberus' },
	{ id: 'rose', name: 'Rose' },
	{ id: 'nosh', name: 'Nosh' },
	{ id: 'mona', name: 'Mona' },
	{ id: 'sahara', name: 'Sahara' },
	{ id: 't3-chat', name: 'T3 Chat' }
] as const;

export const modes = [
	{ id: 'light', name: 'Light' },
	{ id: 'dark', name: 'Dark' },
	{ id: 'system', name: 'System' }
] as const;

function setCookie(name: string, value: string) {
	document.cookie = `${name}=${value}; max-age=31536000; path=/; SameSite=Lax`;
}

export function setThemeContext(initialTheme: string, initialMode: string) {
	let currentTheme = $state(initialTheme);
	let currentMode = $state(initialMode);
	let systemDark = $state(false);

	const ctx = {
		get theme() {
			return currentTheme;
		},
		get mode() {
			return currentMode;
		},
		get isDark() {
			return currentMode === 'dark' || (currentMode === 'system' && systemDark);
		},
		setTheme(id: string, event?: MouseEvent | KeyboardEvent) {
			performTransition(() => {
				currentTheme = id;
				setCookie('theme', id);
			}, event);
		},
		setMode(id: string, event?: MouseEvent | KeyboardEvent) {
			performTransition(() => {
				currentMode = id;
				setCookie('mode', id);
			}, event);
		},
		initClient() {
			$effect(() => {
				const media = window.matchMedia('(prefers-color-scheme: dark)');
				systemDark = media.matches;
				const onChange = (e: MediaQueryListEvent) => (systemDark = e.matches);
				media.addEventListener('change', onChange);

				const isDark = currentMode === 'dark' || (currentMode === 'system' && systemDark);
				document.documentElement.classList.toggle('dark', isDark);
				document.documentElement.setAttribute('data-theme', currentTheme);

				return () => media.removeEventListener('change', onChange);
			});
		}
	};

	setContext(THEME_KEY, ctx);
	return ctx;
}

export type ThemeContext = ReturnType<typeof setThemeContext>;

export function getThemeContext(): ThemeContext {
	return getContext<ThemeContext>(THEME_KEY);
}

async function performTransition(action: () => void, event?: MouseEvent | KeyboardEvent) {
	if (!document.startViewTransition || !event || !(event instanceof MouseEvent)) {
		action();
		return;
	}

	const x = event.clientX;
	const y = event.clientY;
	const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

	document.documentElement.style.setProperty('--x', x + 'px');
	document.documentElement.style.setProperty('--y', y + 'px');

	const transition = document.startViewTransition(async () => {
		action();
		await tick();
	});

	await transition.ready;

	document.documentElement.animate(
		{
			clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`]
		},
		{
			duration: 500,
			easing: 'ease-in-out',
			pseudoElement: '::view-transition-new(root)',
			composite: 'replace'
		}
	);
}
