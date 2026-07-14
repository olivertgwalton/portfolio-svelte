<script lang="ts">
	import LinkIcon from 'phosphor-svelte/lib/LinkIcon';
	import CheckIcon from 'phosphor-svelte/lib/CheckIcon';
	import { fade } from 'svelte/transition';

	let { hash }: { hash: string } = $props();
	let copied = $state(false);

	function copyLink() {
		navigator.clipboard
			.writeText(`${location.origin}${location.pathname}${hash}`)
			.catch((error: unknown) => {
				console.error('Failed to copy link:', error);
			});
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}
</script>

<button
	type="button"
	onclick={copyLink}
	aria-label="Copy link to this section"
	data-copied={copied ? 'true' : undefined}
	class="heading-link relative ml-2 inline-flex align-middle text-surface-600-400 opacity-0 transition-opacity hover:text-primary-500"
>
	{#if copied}
		<span in:fade={{ duration: 150 }}>
			<CheckIcon size={18} weight="bold" class="text-success-500" />
		</span>
	{:else}
		<span in:fade={{ duration: 150 }}>
			<LinkIcon size={18} weight="bold" />
		</span>
	{/if}
</button>
