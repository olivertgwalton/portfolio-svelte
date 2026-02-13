<script lang="ts">
	import ArrowUpRightIcon from 'phosphor-svelte/lib/ArrowUpRightIcon';
	import { socialLinks } from '$lib/site.config';
	import { reveal } from '$lib/actions';

	let {
		size = 'base',
		animated = false
	}: {
		size?: 'base' | 'lg';
		animated?: boolean;
	} = $props();

	const isLarge = $derived(size === 'lg');
</script>

<ul class="{isLarge ? 'space-y-4 font-heading text-2xl font-bold text-surface-950-50' : 'space-y-4 text-lg font-medium text-surface-800-200'}">
	{#each socialLinks as { label, href, icon: Icon }, i (label)}
		<li use:reveal={{ delay: animated ? 450 + i * 50 : 0 }}>
			<a
				{href}
				target="_blank"
				title="{label} (opens in new window)"
				rel="external noopener noreferrer"
				class="flex items-center gap-{isLarge ? '3' : '2'} transition-colors {isLarge ? 'hover:text-surface-600-400' : 'hover:text-surface-950-50 md:justify-end'}"
			>
				<Icon size={isLarge ? 24 : 18} weight={isLarge ? 'bold' : 'regular'} class="shrink-0 text-surface-600-400" />
				{label}
				<span aria-hidden="true"><ArrowUpRightIcon size={isLarge ? 18 : 14} weight={isLarge ? 'bold' : 'regular'} class="text-surface-600-400" /></span>
			</a>
		</li>
	{/each}
</ul>
