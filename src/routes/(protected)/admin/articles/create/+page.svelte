<script lang="ts">
	import ArticleForm from '$lib/components/admin/ArticleForm.svelte';
	let { form } = $props();
</script>

<svelte:head>
	<title>Write New Article | Admin</title>
</svelte:head>

<div class="container mx-auto max-w-4xl px-6 py-24">
	<header class="mb-12">
		<h1 class="font-heading text-5xl font-black tracking-tight text-surface-950-50">New Article.</h1>
		<p class="mt-4 text-surface-600-400">Drafting something new for the world to see.</p>
	</header>

	{#if form?.message}
		<div class="mb-8 rounded p-4 text-sm font-bold preset-tonal-error">
			{form.message}
		</div>
	{/if}

	<ArticleForm submitLabel="Publish Article" />
</div>
