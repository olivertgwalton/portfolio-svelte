<script lang="ts">
	import { enhanceCodeBlocks } from '$lib/actions';
	import 'katex/dist/katex.min.css';
	import type { Snippet } from 'svelte';

	let { children }: { children?: Snippet } = $props();
</script>

<div
	use:enhanceCodeBlocks
	class="prose max-w-none dark:prose-invert prose-figure:m-0 prose-img:m-0"
>
	{@render children?.()}
</div>
