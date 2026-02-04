<script lang="ts">
	import ArticleForm from '$lib/components/admin/ArticleForm.svelte';
	let { form } = $props();
</script>

<svelte:head>
	<title>Write New Article | Admin</title>
</svelte:head>

<div class="container mx-auto max-w-4xl px-6 py-24">
	<header class="mb-12">
		<h1 class="text-foreground font-heading text-5xl font-black tracking-tight">New Article.</h1>
		<p class="text-muted-foreground mt-4">Drafting something new for the world to see.</p>
	</header>

	{#if form?.message}
		<div class="mb-8 rounded bg-red-50 p-4 text-sm font-bold text-red-600 dark:bg-red-900/20">
			{form.message}
		</div>
	{/if}

	<ArticleForm submitLabel="Publish Article" />
</div>
