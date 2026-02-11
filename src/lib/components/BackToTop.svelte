<script lang="ts">
	import ArrowUpIcon from 'phosphor-svelte/lib/ArrowUpIcon';
	import { fade, fly } from 'svelte/transition';

	let scrollY = $state(0);
	const visible = $derived(scrollY > 500);

	function scrollToTop() {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}
</script>

<svelte:window bind:scrollY />

{#if visible}
	<button
		onclick={scrollToTop}
		in:fly={{ y: 20, duration: 300 }}
		out:fade={{ duration: 200 }}
		class="fixed right-6 bottom-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-primary-500 text-white shadow-lg transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-surface-900 md:right-8 md:bottom-8"
		aria-label="Back to Top"
	>
		<ArrowUpIcon size={24} weight="bold" />
	</button>
{/if}
