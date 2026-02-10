<script lang="ts">
	import { enhanceCodeBlocks } from '$lib/actions';
	import 'katex/dist/katex.min.css';

	let { children } = $props();
</script>

<div use:enhanceCodeBlocks class="prose max-w-none dark:prose-invert prose-img:m-0 prose-figure:m-0">
	{@render children?.()}
</div>