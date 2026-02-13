<script lang="ts">
	import { reveal } from '$lib/actions';
	import type { Snippet } from 'svelte';

	let {
		title,
		subtitle,
		class: className = 'mb-16'
	}: {
		title: string;
		subtitle?: Snippet;
		class?: string;
	} = $props();
</script>

<div class="grid gap-8 md:grid-cols-[1fr_auto] md:items-end {className}">
	<div>
		<h2
			use:reveal={{ delay: 0 }}
			class="font-heading text-5xl font-black tracking-tighter text-surface-950-50 md:text-6xl"
		>
			{title}
		</h2>
	</div>
	{#if subtitle}
		<div class="hidden md:block">
			<p
				use:reveal={{ delay: 100 }}
				class="max-w-xs text-right text-sm font-bold tracking-wide text-surface-600-400"
			>
				{@render subtitle()}
			</p>
		</div>
	{/if}
</div>
