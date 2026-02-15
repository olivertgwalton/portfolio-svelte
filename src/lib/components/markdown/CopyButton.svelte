<script lang="ts">
	import CopyIcon from "phosphor-svelte/lib/CopyIcon";
	import CheckIcon from "phosphor-svelte/lib/CheckIcon";
	import { fade } from "svelte/transition";

	let { text } = $props();
	let copied = $state(false);

	async function copyToClipboard() {
		try {
			await navigator.clipboard.writeText(text);
			copied = true;
			setTimeout(() => (copied = false), 2000);
		} catch {
			// Silently fail copy
		}
	}
</script>

<button
	type="button"
	onclick={copyToClipboard}
	class="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-lg border border-surface-200-800 bg-surface-50-950 opacity-0 transition-all group-hover:opacity-100 hover:bg-surface-100-900 focus:opacity-100 focus:ring-2 focus:ring-primary-500 focus:outline-none"
	aria-label="Copy code to clipboard"
>
	{#if copied}
		<div in:fade={{ duration: 150 }}>
			<span aria-hidden="true"
				><CheckIcon
					size={16}
					weight="bold"
					class="text-success-500"
				/></span
			>
		</div>
	{:else}
		<div in:fade={{ duration: 150 }}>
			<span aria-hidden="true"
				><CopyIcon
					size={16}
					weight="bold"
					class="text-surface-600-400"
				/></span
			>
		</div>
	{/if}
</button>
