<script lang="ts">
import CheckIcon from "phosphor-svelte/lib/CheckIcon";
import { fade } from "svelte/transition";
import type { Component } from "svelte";
import type { IconWeight } from "phosphor-svelte";

type PhosphorIcon = Component<{
	size?: number;
	weight?: IconWeight;
	class?: string;
}>;

let {
	text,
	label,
	icon: Icon,
	size = 20,
	class: className = "",
	iconClass = "",
	swapClass = "",
}: {
	text: string | (() => string);
	label: string;
	icon: PhosphorIcon;
	size?: number;
	class?: string;
	iconClass?: string;
	swapClass?: string;
} = $props();

let copied = $state(false);

async function copy() {
	try {
		await navigator.clipboard.writeText(
			typeof text === "function" ? text() : text,
		);
		copied = true;
		setTimeout(() => (copied = false), 2000);
	} catch (error: unknown) {
		console.error("Failed to copy:", error);
	}
}
</script>

<button
	type="button"
	onclick={copy}
	aria-label={label}
	data-copied={copied ? 'true' : undefined}
	class={className}
>
	{#if copied}
		<span in:fade={{ duration: 150 }} class={swapClass} aria-hidden="true">
			<CheckIcon {size} weight="bold" class="text-success-500" />
		</span>
	{:else}
		<span in:fade={{ duration: 150 }} class={swapClass} aria-hidden="true">
			<Icon {size} weight="bold" class={iconClass} />
		</span>
	{/if}
</button>
