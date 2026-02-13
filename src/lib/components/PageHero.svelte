<script lang="ts">
	import InteractiveGrid from '$lib/components/visuals/InteractiveGrid.svelte';
	import type { Snippet } from 'svelte';

	let {
		title,
		subtitle,
		large = false,
		children
	}: {
		title: string;
		subtitle?: Snippet;
		large?: boolean;
		children?: Snippet;
	} = $props();
</script>

<section class="relative min-h-[30vh] w-full overflow-hidden border-b border-surface-200-800/80">
	<InteractiveGrid />
	<div
		class="relative z-10 container mx-auto flex h-full min-h-[30vh] max-w-7xl flex-col justify-end px-6 pt-32 pb-12"
	>
		<div class="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
			<div>
				<h1
					class="font-heading font-black tracking-tighter text-surface-950-50
						{large
						? 'text-6xl whitespace-pre-line sm:text-7xl md:text-8xl'
						: 'text-5xl md:text-8xl'}"
				>
					{title}
				</h1>
			</div>
			{#if subtitle}
				<p
					class="hidden max-w-xs text-right font-mono text-sm tracking-wide text-surface-800-200 md:block"
				>
					{@render subtitle()}
				</p>
			{/if}
		</div>
		{#if children}
			{@render children()}
		{/if}
	</div>
</section>
