<script lang="ts">
	import { mount, unmount } from 'svelte';
	import CopyButton from './CopyButton.svelte';

	let { children } = $props();

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
	{@render children?.()}
</div>
