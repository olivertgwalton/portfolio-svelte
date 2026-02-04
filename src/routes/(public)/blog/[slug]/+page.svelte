<script lang="ts">
	import { resolve } from '$app/paths';
	import MarkdownRenderer from '$lib/components/MarkdownRenderer.svelte';
	import { reveal } from '$lib/actions';

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
	<header
		class="mb-16 border-b border-border pb-12 dark:border-stone-800"
		use:reveal={{ delay: 0, y: 20 }}
	>
		<div class="mb-4 text-xs font-black tracking-widest text-muted uppercase">
			{post.published_at ? formatDate(new Date(post.published_at)) : ''}
		</div>
		<h1
			class="font-heading text-5xl font-black tracking-tight text-primary"
		>
			{post.title}
		</h1>
		{#if post.excerpt}
			<p class="mt-8 text-xl leading-relaxed font-medium text-muted italic">
				{post.excerpt}
			</p>
		{/if}
	</header>

	<div use:reveal={{ delay: 200, y: 20 }}>
		<MarkdownRenderer tokens={post.tokens} />
	</div>

	<footer
		class="mt-24 border-t border-border pt-12 dark:border-stone-800"
		use:reveal={{ delay: 400, y: 20 }}
	>
		<a
			href={resolve('/')}
			class="font-bold text-primary"
		>
			&larr; Back to home
		</a>
	</footer>
</article>
