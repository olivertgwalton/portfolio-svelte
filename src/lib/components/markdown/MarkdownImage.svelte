<script lang="ts">
	import { resolveEnhancedImage } from '$lib/content';

	let { src, alt = '' }: { src: string; alt?: string } = $props();

	// Try to find the enhanced version in our asset map
	const enhanced = $derived(resolveEnhancedImage(src));
</script>

<div class="my-12 overflow-hidden rounded-2xl border border-surface-200-800 shadow-lg">
	{#if enhanced}
		<enhanced:img src={enhanced} {alt} class="h-auto w-full" />
	{:else}
		<img {src} {alt} class="h-auto w-full" />
	{/if}
</div>
