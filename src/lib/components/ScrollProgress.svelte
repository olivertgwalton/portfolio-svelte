<script lang="ts">
	let scrollY = $state(0);
	let innerHeight = $state(0);

	const progress = $derived.by(() => {
		// Reading scrollY makes this reactive to scroll events.
		// Sample scrollHeight at the same time — it's always current.
		const scrollHeight = typeof document !== 'undefined' ? document.documentElement.scrollHeight : 0;
		return scrollHeight <= innerHeight ? 0 : scrollY / (scrollHeight - innerHeight);
	});
</script>

<svelte:window bind:scrollY bind:innerHeight />

<div class="pointer-events-none fixed top-0 left-0 z-60 h-1 w-full bg-transparent">
	<div
		class="h-full bg-primary-500 transition-[width] duration-150 ease-out"
		style:width="{Math.min(progress * 100, 100)}%"
	></div>
</div>
