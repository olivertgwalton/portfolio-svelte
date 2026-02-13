<script lang="ts">
	let scrollY = $state(0);
	let innerHeight = $state(0);
	let scrollHeight = $state(0);

	$effect(() => {
		// Re-runs on every scrollY change, keeping scrollHeight in sync
		void scrollY;
		scrollHeight = document.documentElement.scrollHeight;
	});

	const progress = $derived(
		scrollHeight <= innerHeight ? 0 : scrollY / (scrollHeight - innerHeight)
	);
</script>

<svelte:window bind:scrollY bind:innerHeight />

<div class="pointer-events-none fixed top-0 left-0 z-60 h-1 w-full bg-transparent">
	<div
		class="h-full bg-primary-500"
		style:width="{Math.min(progress * 100, 100)}%"
	></div>
</div>
