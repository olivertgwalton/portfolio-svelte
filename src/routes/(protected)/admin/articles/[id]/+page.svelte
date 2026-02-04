<script lang="ts">
	import ArticleForm from '$lib/components/admin/ArticleForm.svelte';
	let { data, form } = $props();
</script>

<svelte:head>
	<title>Edit Article | Admin</title>
</svelte:head>

<div class="container mx-auto max-w-4xl px-6 py-24">
	<header class="mb-12 flex items-center justify-between">
		<div>
			<h1 class="font-heading text-5xl font-black tracking-tight text-surface-950-50">Edit Article.</h1>
			<p class="mt-4 text-surface-600-400">Polishing the draft.</p>
		</div>
	</header>

	{#if form?.message}
		<div class="mb-8 rounded p-4 text-sm font-bold preset-tonal-error">
			{form.message}
		</div>
	{/if}

	<ArticleForm initialData={data.post} submitLabel="Update Article" />
</div>
