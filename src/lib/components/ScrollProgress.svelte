<script lang="ts">
	import { onMount } from 'svelte';

	let scrollY = $state(0);
	let innerHeight = $state(0);
	let scrollHeight = $state(0);

	function updateScrollHeight() {
		scrollHeight = document.documentElement.scrollHeight;
	}

	onMount(() => {
		updateScrollHeight();
		// Update on resize or mutations (content loading)
		window.addEventListener('resize', updateScrollHeight);
		const observer = new MutationObserver(updateScrollHeight);
		observer.observe(document.body, { childList: true, subtree: true });

		return () => {
			window.removeEventListener('resize', updateScrollHeight);
			observer.disconnect();
		};
	});

	const progress = $derived(
		scrollHeight <= innerHeight ? 0 : scrollY / (scrollHeight - innerHeight)
	);
</script>

<svelte:window bind:scrollY bind:innerHeight />

<div class="pointer-events-none fixed top-0 left-0 z-60 h-1 w-full bg-transparent">
	<div
		class="h-full bg-primary-500 transition-all duration-100 ease-out"
		style:width="{Math.min(progress * 100, 100)}%"
	></div>
</div>
