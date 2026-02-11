<script lang="ts">
	import XIcon from 'phosphor-svelte/lib/XIcon';
	import { fade } from 'svelte/transition';

	let { src, alt, class: className } = $props<{ src: string; alt: string; class?: string }>();
	let zoomed = $state(false);

	function close(e?: Event) {
		e?.stopPropagation();
		zoomed = false;
	}

	function open() {
		zoomed = true;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && zoomed) {
			close();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if zoomed}
	<div
		class="fixed inset-0 z-50 flex cursor-zoom-out items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
		onclick={() => close()}
		onkeydown={(e) => e.key === 'Escape' && close()}
		role="dialog"
		aria-modal="true"
		aria-label="Image zoom view"
		tabindex="-1"
		transition:fade={{ duration: 200 }}
	>
		<button
			class="absolute top-6 right-6 z-60 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
			onclick={close}
			aria-label="Close image zoom"
		>
			<XIcon size={24} weight="bold" />
		</button>

		<enhanced:img
			{src}
			{alt}
			class="h-auto max-h-[90vh] w-auto max-w-[90vw] rounded-lg object-contain shadow-2xl"
			sizes="100vw"
		/>
	</div>
{/if}

<button
	onclick={open}
	class="group block w-full cursor-zoom-in overflow-hidden rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
	aria-label="Zoom image: {alt}"
>
	<enhanced:img
		{src}
		{alt}
		class="h-auto w-full transition-transform duration-500 group-hover:scale-105 {className}"
	/>
</button>
