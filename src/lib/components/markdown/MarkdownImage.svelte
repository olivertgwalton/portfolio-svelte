<script lang="ts">
import XIcon from "phosphor-svelte/lib/XIcon";
import { Dialog, Portal } from "@skeletonlabs/skeleton-svelte";

let {
	src,
	alt,
	class: className,
	size,
} = $props<{
	src: string;
	alt: string;
	class?: string;
	size?: "sm" | "md" | "lg";
}>();
const sizeClasses: Record<string, string> = {
	sm: "max-w-sm mx-auto",
	md: "max-w-xl mx-auto",
	lg: "max-w-3xl mx-auto",
};
const wrapperClass = $derived(size ? sizeClasses[size] : "");
</script>

<figure class={wrapperClass}>
	<Dialog>
		<Dialog.Trigger
			class="image-card group block w-full cursor-zoom-in overflow-hidden rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
			aria-label="Zoom image: {alt}"
		>
			<enhanced:img
				{src}
				{alt}
				class="block h-auto w-full transition-transform duration-500 group-hover:scale-105 {className}"
			/>
		</Dialog.Trigger>
		<Portal>
			<Dialog.Backdrop
				class="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm"
			/>
			<Dialog.Positioner
				class="fixed inset-0 z-50 flex items-center justify-center p-4"
			>
				<Dialog.Content
					class="relative flex max-h-full max-w-full items-center justify-center"
				>
					<Dialog.Title class="sr-only">{alt || 'Expanded image'}</Dialog.Title>
					<Dialog.Description class="sr-only"
						>Expanded image preview</Dialog.Description
					>
					<Dialog.CloseTrigger
						class="btn-icon btn-icon-lg absolute top-2 right-2 z-10 bg-white/10 text-white hover:bg-white/20"
						aria-label="Close image zoom"
					>
						<XIcon weight="bold" />
					</Dialog.CloseTrigger>
					<enhanced:img
						{src}
						{alt}
						class="h-auto max-h-[90vh] w-auto max-w-[90vw] rounded-lg object-contain shadow-2xl"
						sizes="100vw"
					/>
				</Dialog.Content>
			</Dialog.Positioner>
		</Portal>
	</Dialog>
	{#if alt}
		<figcaption class="text-center font-mono text-xs text-surface-600-400">
			{alt}
		</figcaption>
	{/if}
</figure>

<style>
figure {
	margin: 0;
}

figure :global(figcaption) {
	margin: 0;
}

.image-card :global(picture) {
	display: block;
}
</style>
