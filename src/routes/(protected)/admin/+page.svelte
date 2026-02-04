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
			<h1 class="text-foreground font-heading text-6xl font-black tracking-tight">
				Dashboard<span class="text-muted-foreground">.</span>
			</h1>
			<p class="text-muted-foreground mt-4 text-xl">Manage your content.</p>
		</div>
	</header>

	<div class="mx-auto max-w-4xl">
		<!-- Articles Section -->
		<section class="space-y-8">
			<div class="border-border flex items-center justify-between border-b pb-4">
				<h2 class="text-foreground font-heading text-3xl font-bold">Articles</h2>
				<a
					href={resolve('/admin/articles/create')}
					class="btn-polished btn-polished-primary bg-card px-6 py-2 text-xs font-bold text-white hover:bg-black"
				>
					+ New Article
				</a>
			</div>

			<ul class="space-y-4">
				{#if data?.posts?.length}
					{#each data.posts as post (post.id)}
						<li
							class="group /50 flex items-center justify-between rounded-lg border border-stone-100 bg-white p-4 transition-all hover:border-stone-300 hover:shadow-sm"
						>
							<div class="min-w-0 flex-1 pr-4">
								<a
									href={resolve(`/blog/${post.slug}`)}
									class="text-foreground block truncate font-bold"
									target="_blank"
								>
									{post.title}
								</a>
								<span class="text-muted-foreground text-xs font-medium">
									{safeDate(post.publishedAt)}
								</span>
							</div>
							<div
								class="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100"
							>
								<a
									href={resolve(`/admin/articles/${post.id}`)}
									class="text-muted-foreground hover:bg-card hover:text-foreground rounded px-3 py-1 text-xs font-bold"
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
					<li class="text-muted-foreground py-8 text-center text-sm">No articles yet.</li>
				{/if}
			</ul>
		</section>
	</div>
</div>
