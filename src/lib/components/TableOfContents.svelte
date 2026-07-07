<script lang="ts">
	import { CaretDownIcon, ListIcon } from 'phosphor-svelte';
	import type { TocHeading } from '$lib/toc.svelte';

	let {
		layout = 'sidebar',
		headings,
		activeId,
		onNavigate
	}: {
		layout?: 'sidebar' | 'collapsible';
		headings: TocHeading[];
		activeId: string;
		onNavigate: (id: string) => void;
	} = $props();
</script>

{#if headings.length > 0}
	{#if layout === 'sidebar'}
		<nav
			class="no-scrollbar sticky top-32 hidden max-h-[calc(100vh-8rem)] overflow-y-auto lg:block"
		>
			<h2 class="text-surface-600-200 mb-6 text-xs font-bold tracking-[0.2em] uppercase">
				Contents
			</h2>
			<div class="relative">
				<!-- Decorative timeline line -->
				<div class="absolute top-0 bottom-0 left-0 w-px bg-surface-200 dark:bg-surface-800"></div>
				<ul class="space-y-3 text-sm">
					{#each headings as heading (heading.id)}
						<li class:pl-4={heading.depth === 3} class="relative">
							<a
								href="#{heading.id}"
								class="group flex items-start py-0.5 pl-4 transition-all duration-300 ease-out
                        {activeId === heading.id
									? 'translate-x-1 font-medium text-(--color-primary-500-text)'
									: 'text-surface-600-200 hover:translate-x-1 hover:text-surface-950-50'}"
								onclick={(e) => {
									e.preventDefault();
									onNavigate(heading.id);
								}}
							>
								<!-- Active Indicator Dot -->
								{#if activeId === heading.id}
									<div
										class="absolute top-1.5 left-[-1.5px] h-3 w-0.5 rounded-full bg-primary-500 transition-all duration-300"
										style:height="calc(100% - 12px)"
									></div>
								{/if}
								<span class="line-clamp-2">{heading.text}</span>
							</a>
						</li>
					{/each}
				</ul>
			</div>
		</nav>
	{:else}
		<!-- Mobile Collapsible View -->
		<div class="mb-12 block lg:hidden">
			<details
				class="group overflow-hidden rounded-xl border border-surface-200-800 bg-surface-50-950 transition-all duration-300 open:ring-1 open:ring-primary-500/20"
			>
				<summary
					class="flex cursor-pointer items-center justify-between p-4 font-heading text-sm font-bold tracking-tight text-surface-950-50 select-none hover:bg-surface-100-900 focus:outline-none"
				>
					<div class="flex items-center gap-3">
						<span aria-hidden="true"><ListIcon class="size-4 text-primary-500" /></span>
						<span class="text-xs font-bold tracking-[0.2em] text-surface-400 uppercase"
							>Contents</span
						>
					</div>
					<span aria-hidden="true"><CaretDownIcon
						class="size-4 text-surface-500 transition-transform duration-300 group-open:-rotate-180"
					/></span>
				</summary>
				<nav class="border-t border-surface-200-800 bg-surface-100-900/80 px-6 py-6">
					<div class="relative">
						<!-- Decorative timeline line -->
						<div
							class="absolute top-0 bottom-0 left-0 w-px bg-surface-200 dark:bg-surface-800"
						></div>
						<ul class="space-y-4 text-sm">
							{#each headings as heading (heading.id)}
								<li class:pl-4={heading.depth === 3} class="relative">
									<a
										href="#{heading.id}"
										class="group flex items-start py-0.5 pl-4 transition-all duration-300 ease-out
                                    {activeId === heading.id
											? 'translate-x-1 font-medium text-(--color-primary-500-text)'
											: 'text-surface-800-200 hover:translate-x-1 hover:text-surface-950-50'}"
										onclick={(e) => {
											e.preventDefault();
											e.currentTarget.closest('details')?.removeAttribute('open');
											setTimeout(() => onNavigate(heading.id), 10);
										}}
									>
										<!-- Active Indicator Dot -->
										{#if activeId === heading.id}
											<div
												class="absolute top-1.5 left-[-1.5px] h-3 w-0.5 rounded-full bg-primary-500 transition-all duration-300"
												style:height="calc(100% - 12px)"
											></div>
										{/if}
										<span class="line-clamp-2">{heading.text}</span>
									</a>
								</li>
							{/each}
						</ul>
					</div>
				</nav>
			</details>
		</div>
	{/if}
{/if}

<style>
	/* Hide scrollbar for Chrome, Safari and Opera */
	.no-scrollbar::-webkit-scrollbar {
		display: none;
	}

	/* Hide scrollbar for IE, Edge and Firefox */
	.no-scrollbar {
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}
</style>
