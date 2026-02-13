<script lang="ts">
	import { getHSL } from '$lib/utils';
	import { getEnhancedImage } from '$lib/images';
	import CodeIcon from 'phosphor-svelte/lib/CodeIcon';

	let {
		image,
		title,
		showIcon = false,
		overlay = false
	}: {
		image?: string;
		title: string;
		showIcon?: boolean;
		overlay?: boolean;
	} = $props();

	const img = $derived(getEnhancedImage(image));
</script>

{#if img}
	<div class="relative h-48 w-full overflow-hidden">
		<enhanced:img
			src={img}
			alt={title}
			sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
			class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
		/>
		{#if overlay}
			<div class="from-surface-100-800 absolute inset-0 bg-linear-to-t to-transparent"></div>
		{/if}
	</div>
{:else if image}
	<div class="relative h-48 w-full overflow-hidden">
		<img
			src={image}
			alt={title}
			class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
		/>
		{#if overlay}
			<div class="from-surface-100-800 absolute inset-0 bg-linear-to-t to-transparent"></div>
		{/if}
	</div>
{:else}
	<div
		class="relative h-48 w-full overflow-hidden bg-grid-paper opacity-30 transition-opacity group-hover:opacity-60"
		style="background-color: {getHSL(title)};"
	>
		<div class="from-surface-100-800 absolute inset-0 bg-linear-to-t to-transparent"></div>
		{#if showIcon}
			<span
				aria-hidden="true"
				class="absolute inset-0 flex items-center justify-center"
			>
				<CodeIcon size={48} weight="thin" class="text-surface-400" />
			</span>
		{/if}
	</div>
{/if}
