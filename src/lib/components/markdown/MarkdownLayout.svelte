<script lang="ts">
	import { mount, unmount } from 'svelte';
	import CopyButton from './CopyButton.svelte';
	import MarkdownImage from './MarkdownImage.svelte';

	// We keep MarkdownImage as a mapped component as it works reliably
	export const img = MarkdownImage;

	function enhanceCodeBlocks(node: HTMLElement) {
		const components: ReturnType<typeof mount>[] = [];

		const pres = node.querySelectorAll('pre');

		for (const pre of pres) {
			// Ensure formatting for positioning
			pre.classList.add('relative', 'group');

			// Mount the copy button
			const component = mount(CopyButton, {
				target: pre,
				props: { text: pre.innerText }
			});

			components.push(component);
		}

		return {
			destroy() {
				components.forEach((c) => unmount(c));
			}
		};
	}
</script>

<div use:enhanceCodeBlocks>
	<slot />
</div>
