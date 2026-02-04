<script lang="ts">
	import { page } from '$app/state';
	import { resolve, asset } from '$app/paths';
	import ListIcon from 'phosphor-svelte/lib/ListIcon';
    import SignOutIcon from 'phosphor-svelte/lib/SignOutIcon';
	import { Menu, Portal } from '@skeletonlabs/skeleton-svelte';
	import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte';
	import { reveal } from '$lib/actions';
    import { authClient } from '$lib/auth/client';
    import { goto } from '$app/navigation';

	const links = [
		{ href: '/', label: 'Home' },
		{ href: '/blog', label: 'Writing' },
		{ href: '/about', label: 'About' },
		{ href: '/contact', label: 'Contact' }
	] as const;

    const session = authClient.useSession();

    async function signOut() {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    goto('/');
                }
            }
        });
    }
</script>

<nav
	class="sticky top-0 z-50 w-full border-b border-surface-200-800 bg-surface-50-950/90 backdrop-blur-md transition-all duration-300"
>
	<div class="container mx-auto flex items-center justify-between px-6 pt-3 pb-4">
		<!-- Logo -->
		<a
			use:reveal={{ delay: 0, y: -4, duration: 800 }}
			href={resolve('/')}
			class="font-heading text-2xl font-bold tracking-tighter text-surface-950-50"
		>
			Oliver<span class="text-surface-600-400">.</span>
		</a>

		<!-- Desktop Links -->
		<div class="hidden items-center justify-center gap-8 md:flex">
			{#each links as link, i (link.href)}
				{@const isActive = page.url.pathname === link.href}
				<a
					use:reveal={{ delay: 100 + i * 30, y: -4, duration: 800 }}
					href={resolve(link.href)}
					aria-current={isActive ? 'page' : undefined}
					class="group relative text-sm leading-none font-semibold tracking-wide text-surface-600-400 transition-colors hover:text-surface-950-50
								{isActive ? 'text-surface-950-50' : ''}"
				>
					{link.label}
					<span
						class="absolute -bottom-1 left-0 h-px w-full origin-left bg-surface-950-50 transition-transform duration-300 ease-out {isActive
							? 'scale-x-100'
							: 'scale-x-0 group-hover:scale-x-100'}"
					></span>
				</a>
			{/each}
		</div>

		<div class="flex items-center gap-4" use:reveal={{ delay: 300, y: -4, duration: 800 }}>
			<!-- Theme Toggle -->
			<ThemeSwitcher />

            {#if $session.data}
                <button 
                    onclick={signOut}
                    class="btn-icon hover:preset-tonal"
                    aria-label="Sign Out"
                    title="Sign Out"
                >
                    <SignOutIcon size={20} weight="bold" />
                </button>
            {/if}

			<!-- Mobile Menu Button -->
			<div class="md:hidden">
				<Menu>
					<Menu.Trigger class="rounded-md p-2 text-surface-950-50" aria-label="Open Menu">
						<ListIcon size={24} weight="bold" />
					</Menu.Trigger>
					<Portal>
						<Menu.Positioner>
							<Menu.Content
								class="z-50 w-64 rounded-xl border border-surface-200-800 bg-surface-50-950 p-2 shadow-lg"
							>
								{#each links as link (link.href)}
									{@const isActive = page.url.pathname === link.href}
									<Menu.Item value={link.href}>
										{#snippet element(attributes)}
											<a
												{...attributes as import('svelte/elements').HTMLAnchorAttributes}
												href={resolve(link.href)}
												class="block w-full rounded-lg px-4 py-3 text-sm font-bold {isActive
													? 'bg-surface-200-800 text-surface-950-50'
													: 'text-surface-600-400 hover:bg-surface-100-900'}"
											>
												{link.label}
											</a>
										{/snippet}
									</Menu.Item>
								{/each}
								<Menu.Separator class="my-2 h-px bg-surface-200-800" />
								<Menu.Item value="cv">
									{#snippet element(attributes)}
										<a
											{...attributes as import('svelte/elements').HTMLAnchorAttributes}
											href={asset('/CV.pdf')}
											class="btn block w-full preset-outlined-surface-200-800 btn-sm py-2 text-center text-xs"
										>
											Download CV
										</a>
									{/snippet}
								</Menu.Item>
							</Menu.Content>
						</Menu.Positioner>
					</Portal>
				</Menu>
			</div>

			<!-- CTA Button -->
			<div class="hidden md:block">
				<a href={asset('/CV.pdf')} class="btn preset-filled-primary-500 btn-sm px-5 py-2 text-xs">
					CV
				</a>
			</div>
		</div>
	</div>
</nav>
