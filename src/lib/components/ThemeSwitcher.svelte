<script lang="ts">
	import PaletteIcon from 'phosphor-svelte/lib/PaletteIcon';
	import CheckIcon from 'phosphor-svelte/lib/CheckIcon';
	import MoonIcon from 'phosphor-svelte/lib/MoonIcon';
	import SunIcon from 'phosphor-svelte/lib/SunIcon';
	import MonitorIcon from 'phosphor-svelte/lib/MonitorIcon';
	import { Menu } from '@skeletonlabs/skeleton-svelte';
	import { onMount, tick } from 'svelte';

	const themes = [
		{ id: 'cerberus', name: 'Cerberus' },
		{ id: 'rose', name: 'Rose' },
		{ id: 'nosh', name: 'Nosh' },
		{ id: 'mona', name: 'Mona' },
		{ id: 'sahara', name: 'Sahara' },
		{ id: 't3-chat', name: 'T3 Chat' }
	];

	const modes = [
		{ id: 'light', name: 'Light', icon: SunIcon },
		{ id: 'dark', name: 'Dark', icon: MoonIcon },
		{ id: 'system', name: 'System', icon: MonitorIcon }
	];

	let currentTheme = $state('cerberus');

	let currentMode = $state('system');

	let systemDark = $state(false);

	function setCookie(name: string, value: string) {
		document.cookie = `${name}=${value}; max-age=31536000; path=/; SameSite=Lax`;
	}

	function getCookie(name: string) {
		return document.cookie
			.split('; ')
			.find((row) => row.startsWith(name + '='))
			?.split('=')[1];
	}

	// Reactive: Sync System Preference

	$effect(() => {
		const media = window.matchMedia('(prefers-color-scheme: dark)');

		systemDark = media.matches;

		const onChange = (e: MediaQueryListEvent) => {
			systemDark = e.matches;
		};

		media.addEventListener('change', onChange);

		return () => media.removeEventListener('change', onChange);
	});

	// Reactive: Update DOM for Dark Mode

	$effect(() => {
		const isDark = currentMode === 'dark' || (currentMode === 'system' && systemDark);

		document.documentElement.classList.toggle('dark', isDark);
	});

	// Reactive: Update DOM for Theme

	$effect(() => {
		document.documentElement.setAttribute('data-theme', currentTheme);
	});

	// Helper to perform the circular transition

	async function performTransition(action: () => void, event?: MouseEvent | KeyboardEvent) {
		if (!document.startViewTransition || !event || !(event instanceof MouseEvent)) {
			action();

			return;
		}

		const x = event.clientX;

		const y = event.clientY;

		const endRadius = Math.hypot(
			Math.max(x, innerWidth - x),

			Math.max(y, innerHeight - y)
		);

		// Set variables for CSS to prevent flash

		document.documentElement.style.setProperty('--x', x + 'px');

		document.documentElement.style.setProperty('--y', y + 'px');

		const transition = document.startViewTransition(async () => {
			action();

			await tick();
		});

		await transition.ready;

		const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`];

		document.documentElement.animate(
			{
				clipPath: clipPath
			},

			{
				duration: 500,

				easing: 'ease-in-out',

				pseudoElement: '::view-transition-new(root)'
			}
		);
	}

	function setTheme(theme: string, event?: MouseEvent | KeyboardEvent) {
		performTransition(() => {
			currentTheme = theme;

			setCookie('theme', theme);
		}, event);
	}

	function setMode(mode: string, event?: MouseEvent | KeyboardEvent) {
		performTransition(() => {
			currentMode = mode;

			setCookie('mode', mode);
		}, event);
	}

	onMount(() => {
		// Initialize state from cookie (server-side sync)

		const savedTheme = getCookie('theme');

		if (savedTheme && themes.find((t) => t.id === savedTheme)) {
			currentTheme = savedTheme;
		}

		const savedMode = getCookie('mode');

		if (savedMode) {
			currentMode = savedMode;
		}
	});
</script>

<Menu>
	<Menu.Trigger class="btn-icon hover:preset-tonal" aria-label="Appearance">
		<PaletteIcon size={20} weight="bold" />
	</Menu.Trigger>
	<Menu.Positioner>
		<Menu.Content
			class="z-50 w-56 rounded-container border border-surface-200-800 bg-surface-50-950 p-2 shadow-xl"
		>
				<Menu.ItemGroup>
					<Menu.ItemGroupLabel class="px-3 py-1.5 text-xs font-bold uppercase opacity-60">Theme</Menu.ItemGroupLabel>
					{#each themes as theme (theme.id)}
						<Menu.Item
							value={theme.id}
							onclick={(e) => setTheme(theme.id, e)}
							class="flex cursor-pointer items-center justify-between rounded-container px-3 py-2 text-sm font-medium transition-colors hover:preset-tonal {currentTheme ===
							theme.id
								? 'text-primary-500'
								: ''}"
						>
							<Menu.ItemText>{theme.name}</Menu.ItemText>
							{#if currentTheme === theme.id}
								<Menu.ItemIndicator><CheckIcon size={16} weight="bold" /></Menu.ItemIndicator>
							{/if}
						</Menu.Item>
					{/each}
				</Menu.ItemGroup>

				<Menu.Separator class="my-1 h-px bg-surface-200-800" />

				<Menu.ItemGroup>
					<Menu.ItemGroupLabel class="px-3 py-1.5 text-xs font-bold uppercase opacity-60">Mode</Menu.ItemGroupLabel>
					{#each modes as mode (mode.id)}
						{@const Icon = mode.icon}
						<Menu.Item
							value={mode.id}
							onclick={(e) => setMode(mode.id, e)}
							class="flex cursor-pointer items-center justify-between rounded-container px-3 py-2 text-sm font-medium transition-colors hover:preset-tonal {currentMode ===
							mode.id
								? 'text-primary-500'
								: ''}"
						>
							<div class="flex items-center gap-2">
								<Icon size={16} />
								<Menu.ItemText>{mode.name}</Menu.ItemText>
							</div>
							{#if currentMode === mode.id}
								<Menu.ItemIndicator><CheckIcon size={16} weight="bold" /></Menu.ItemIndicator>
							{/if}
						</Menu.Item>
					{/each}
				</Menu.ItemGroup>
			</Menu.Content>
	</Menu.Positioner>
</Menu>
