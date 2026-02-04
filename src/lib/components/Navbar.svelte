<script lang="ts">
	import { page } from '$app/state';
	import { resolve, asset } from '$app/paths';
	import Sun from 'phosphor-svelte/lib/Sun';
	import Moon from 'phosphor-svelte/lib/Moon';
	import List from 'phosphor-svelte/lib/List';
	import { Button, DropdownMenu } from 'bits-ui';
	import { Switch } from '@skeletonlabs/skeleton-svelte';
	import { theme } from '$lib/theme.svelte';

	const links = [
		{ href: '/', label: 'Home' },
		{ href: '/blog', label: 'Writing' },
		{ href: '/about', label: 'About' },
		{ href: '/contact', label: 'Contact' }
	];

	// Store click coordinates for the view transition as Switch onclick is specific
	let clickCoords = { x: 0, y: 0 };

	function captureClick(e: MouseEvent) {
		clickCoords = { x: e.clientX, y: e.clientY };
	}

	function handleSwitchChange() {
		// Pass the captured coordinates to the theme store
		theme.toggle({ clientX: clickCoords.x, clientY: clickCoords.y });
	}
</script>

<nav
	class="sticky top-0 z-50 w-full border-b border-stone-200 bg-(--color-base)/90 backdrop-blur-md transition-all duration-300 dark:border-stone-800"
>
	<div class="container mx-auto flex items-center justify-between px-6 py-4">
		<!-- Logo -->
		<a
			href={resolve('/')}
			class="font-serif text-2xl font-bold tracking-tighter text-stone-900 transition-opacity hover:opacity-70 dark:text-stone-100"
		>
			Oliver<span class="text-stone-400">.</span>
		</a>

		<!-- Desktop Links -->
		<div class="hidden items-center gap-8 md:flex">
			{#each links as link (link.href)}
				{@const isActive = page.url.pathname === link.href}
				<a
					href={resolve(link.href)}
					aria-current={isActive ? 'page' : undefined}
					class="relative text-sm font-semibold tracking-wide text-stone-600 transition-colors hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200
								{isActive ? 'text-stone-900 dark:text-stone-100' : ''}"
				>
					{link.label}
					{#if isActive}
						<span class="absolute -bottom-1 left-0 h-px w-full bg-stone-900 dark:bg-stone-100"
						></span>
					{/if}
				</a>
			{/each}
		</div>

		<div class="flex items-center gap-4">
			<!-- Theme Toggle (Skeleton Switch) -->
			<Switch
				checked={theme.isDark}
				onCheckedChange={handleSwitchChange}
				onclick={captureClick}
				aria-label="Toggle Dark Mode"
				class="group inline-flex items-center justify-center rounded-full focus-visible:ring-2 focus-visible:ring-stone-400 focus-visible:ring-offset-2 focus-visible:outline-none"
			>
				<Switch.HiddenInput />
				<Switch.Control
					class="inline-flex h-8 w-14 cursor-pointer items-center rounded-full bg-stone-200 transition-colors data-[state=checked]:bg-stone-800 dark:bg-stone-700 dark:data-[state=checked]:bg-stone-600"
				>
					<Switch.Thumb
						class="pointer-events-none block h-6 w-6 translate-x-1 rounded-full bg-white shadow-lg transition-transform duration-200 will-change-transform data-[state=checked]:translate-x-7"
					>
						<div class="flex h-full w-full items-center justify-center text-stone-900">
							{#if theme.isDark}
								<Moon size={14} weight="bold" />
							{:else}
								<Sun size={14} weight="bold" />
							{/if}
						</div>
					</Switch.Thumb>
				</Switch.Control>
			</Switch>

			<!-- Mobile Menu Button -->
			<div class="md:hidden">
				<DropdownMenu.Root>
					<DropdownMenu.Trigger
						class="rounded-md p-2 text-stone-900 dark:text-stone-100"
						aria-label="Open Menu"
					>
						<List size={24} weight="bold" />
					</DropdownMenu.Trigger>
					<DropdownMenu.Content
						class="z-50 w-64 rounded-xl border border-stone-200 bg-white p-2 shadow-lg dark:border-stone-800 dark:bg-stone-900"
						align="end"
						sideOffset={8}
					>
						{#each links as link (link.href)}
							{@const isActive = page.url.pathname === link.href}
							<DropdownMenu.Item
								class="rounded-lg px-4 py-3 text-sm font-bold {isActive
									? 'bg-stone-100 text-stone-900 dark:bg-stone-800 dark:text-stone-100'
									: 'text-stone-600 hover:bg-stone-50 dark:text-stone-400 dark:hover:bg-stone-800/50'}"
							>
								<a href={resolve(link.href)} class="block w-full">{link.label}</a>
							</DropdownMenu.Item>
						{/each}
						<DropdownMenu.Separator class="my-2 h-px bg-stone-100 dark:bg-stone-800" />
						<DropdownMenu.Item class="p-2">
							<a
								href={asset('/CV.pdf')}
								class="btn-polished btn-polished-secondary block w-full py-2 text-center text-xs dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 dark:hover:bg-stone-700"
							>
								Download CV
							</a>
						</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>

			<!-- CTA Button -->
			<div class="hidden md:block">
				<Button.Root
					href={asset('/CV.pdf')}
					class="btn-polished btn-polished-secondary px-5 py-2 text-xs dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 dark:hover:bg-stone-700"
				>
					CV
				</Button.Root>
			</div>
		</div>
	</div>
</nav>
