<script lang="ts">
	import { formatDate } from '$lib/utils';
	import MetaTags from '$lib/components/MetaTags.svelte';

	let { data } = $props();
</script>

<MetaTags
	title={data.meta.title}
	description={data.meta.description}
	type="article"
/>

<article class="container mx-auto max-w-3xl px-6 py-24">
	<header class="mb-12 text-center">
		<div class="mb-4 flex items-center justify-center gap-2 text-sm font-bold text-surface-600-400">
			<time datetime={data.meta.date}>{formatDate(data.meta.date)}</time>
			{#if data.meta.tags}
				<span>•</span>
				<div class="flex gap-2">
					{#each data.meta.tags as tag}
						<span class="text-primary-500 uppercase tracking-wider">{tag}</span>
					{/each}
				</div>
			{/if}
		</div>
		<h1 class="font-heading text-4xl font-black tracking-tighter text-surface-950-50 sm:text-5xl md:text-6xl">
			{data.meta.title}
		</h1>
	</header>

	<div class="prose prose-lg dark:prose-invert mx-auto">
		{@html data.content}
	</div>
</article>
