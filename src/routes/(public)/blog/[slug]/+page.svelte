<script lang="ts">
	import { resolve } from '$app/paths';
	import MarkdownRenderer from '$lib/components/MarkdownRenderer.svelte';

	let { data } = $props();
	let post = $derived(data.post);

	function formatDate(date: Date) {
		return new Intl.DateTimeFormat('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		}).format(date);
	}
</script>

<svelte:head>
	<title>{post.title} | Oliver Walton</title>
	<meta name="description" content={post.excerpt} />
</svelte:head>

<article class="container mx-auto max-w-5xl px-6 py-32">
	<header class="mb-16 border-b border-stone-200 pb-12 dark:border-stone-800">
		<div class="mb-4 text-xs font-black tracking-widest text-stone-400 uppercase">
			{post.published_at ? formatDate(new Date(post.published_at)) : ''}
		</div>
		<h1
			class="font-serif text-5xl font-black tracking-tight text-stone-900 md:text-6xl dark:text-stone-100"
		>
			{post.title}
		</h1>
		{#if post.excerpt}
			<p class="mt-8 text-xl leading-relaxed font-medium text-stone-500 italic">
				{post.excerpt}
			</p>
		{/if}
	</header>

	<MarkdownRenderer tokens={post.tokens} />

	<footer class="mt-24 border-t border-stone-200 pt-12 dark:border-stone-800">
		<a
			href={resolve('/')}
			class="font-bold text-stone-900 transition-colors hover:text-stone-500 dark:text-stone-100"
		>
			&larr; Back to home
		</a>
	</footer>
</article>
