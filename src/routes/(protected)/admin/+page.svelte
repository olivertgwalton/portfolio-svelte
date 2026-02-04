<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import { toast } from 'svelte-sonner';
	let { data } = $props();

	function safeDate(date: Date | string | number | null) {
		if (!date) return 'Unknown Date';
		const d = new Date(date);
		return isNaN(d.getTime()) ? 'Invalid Date' : d.toLocaleDateString();
	}
</script>

<svelte:head>
	<title>Admin Dashboard | Oliver Walton</title>
</svelte:head>

<div class="container mx-auto max-w-6xl px-6 py-32">
	<header class="mb-24 flex items-end justify-between">
		<div>
			<h1 class="font-serif text-6xl font-black tracking-tight text-stone-900 dark:text-stone-100">
				Dashboard<span class="text-stone-400">.</span>
			</h1>
			<p class="mt-4 text-xl text-stone-500">Manage your content.</p>
		</div>
	</header>

	<div class="mx-auto max-w-4xl">
		<!-- Articles Section -->
		<section class="space-y-8">
			<div
				class="flex items-center justify-between border-b border-stone-200 pb-4 dark:border-stone-800"
			>
				<h2 class="font-serif text-3xl font-bold text-stone-900 dark:text-stone-100">Articles</h2>
				<a
					href={resolve('/admin/articles/create')}
					class="btn-polished btn-polished-primary bg-stone-900 px-6 py-2 text-xs font-bold text-white hover:bg-black"
				>
					+ New Article
				</a>
			</div>

			<ul class="space-y-4">
				{#if data?.posts?.length}
					{#each data.posts as post (post.id)}
						<li
							class="group flex items-center justify-between rounded-lg border border-stone-100 bg-white p-4 transition-all hover:border-stone-300 hover:shadow-sm dark:border-stone-800 dark:bg-stone-900/50"
						>
							<div class="min-w-0 flex-1 pr-4">
								<a
									href={resolve(`/blog/${post.slug}`)}
									class="block truncate font-bold text-stone-900 hover:underline dark:text-stone-100"
									target="_blank"
								>
									{post.title}
								</a>
								<span class="text-xs font-medium text-stone-400">
									{safeDate(post.publishedAt)}
								</span>
							</div>
							<div
								class="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100"
							>
								<a
									href={resolve(`/admin/articles/${post.id}`)}
									class="rounded px-3 py-1 text-xs font-bold text-stone-500 hover:bg-stone-100 hover:text-stone-900 dark:hover:bg-stone-800 dark:hover:text-stone-100"
								>
									Edit
								</a>
								<form
									action="?/deletePost"
									method="POST"
									use:enhance={() => {
										const toastId = toast.loading('Deleting article...');
										return async ({ result, update }) => {
											if (result.type === 'success') {
												toast.success('Article deleted.', { id: toastId });
											} else {
												toast.error('Failed to delete article.', { id: toastId });
											}
											await update();
										};
									}}
								>
									<input type="hidden" name="id" value={post.id} />
									<button
										type="submit"
										class="rounded px-3 py-1 text-xs font-bold text-red-500 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20"
										onclick={(e) => !confirm('Delete this article?') && e.preventDefault()}
									>
										Delete
									</button>
								</form>
							</div>
						</li>
					{/each}
				{:else}
					<li class="py-8 text-center text-sm text-stone-400">No articles yet.</li>
				{/if}
			</ul>
		</section>
	</div>
</div>
