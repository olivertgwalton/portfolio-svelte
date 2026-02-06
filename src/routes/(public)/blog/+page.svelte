<script lang="ts">
	import { resolve } from '$app/paths';
	import { reveal } from '$lib/actions';
	import ArrowRightIcon from 'phosphor-svelte/lib/ArrowRightIcon';
	import InteractiveGrid from '$lib/components/visuals/InteractiveGrid.svelte';

	let { data } = $props();

	function formatDate(dateStr: string) {
		if (!dateStr) return '';
		return new Intl.DateTimeFormat('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		}).format(new Date(dateStr));
	}
</script>

<svelte:head>
	<title>Writing | Oliver Walton</title>
	<meta name="description" content="Thoughts on software engineering, design, and systems." />
</svelte:head>

<section class="relative min-h-[40vh] w-full overflow-hidden border-b border-surface-200-800">
	<InteractiveGrid />
	<div
		class="relative z-10 container mx-auto flex h-full min-h-[40vh] flex-col justify-end px-6 pt-32 pb-16"
	>
		<div class="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
			<div>
				<h1
					use:reveal={{ delay: 0, y: 20 }}
					class="font-heading text-6xl font-black tracking-tighter text-surface-950-50 sm:text-7xl md:text-8xl"
				>
					Writing.
				</h1>
			</div>
			<p
				use:reveal={{ delay: 100, y: 20 }}
				class="hidden max-w-xs text-right font-mono text-sm tracking-wide text-surface-600-400 md:block"
			>
				Archive of thoughts, <br />notes, and experiments.
			</p>
		</div>
	</div>
</section>

<section class="min-h-screen bg-surface-50-950">
	<div class="container mx-auto max-w-5xl px-6 py-24">
		<!-- Posts List -->
		<div class="flex flex-col gap-12">
			{#each data.posts as post, i (post.slug)}
				<a
					href={resolve(`/blog/${post.slug}`)}
					class="group bg-surface-100-800 hover:bg-surface-200-700 relative flex flex-col gap-6 rounded-2xl border border-surface-200-800 p-8 transition-all hover:border-primary-500/50 md:flex-row md:items-start md:gap-12"
					use:reveal={{ delay: i * 50 }}
				>
					<!-- Date Column -->
					<div class="shrink-0 md:w-32">
						<time
							datetime={post.date}
							class="font-mono text-xs font-bold tracking-wider text-surface-500 uppercase"
						>
							{formatDate(post.date)}
						</time>
					</div>

					<!-- Content Column -->
					<div class="flex grow flex-col gap-4">
						<h3
							class="font-heading text-2xl leading-tight font-bold tracking-tight text-surface-950-50 transition-colors group-hover:text-primary-500 sm:text-3xl"
						>
							{post.title}
						</h3>
						<p class="line-clamp-2 max-w-2xl text-base leading-relaxed text-surface-600-400">
							{post.description}
						</p>
						{#if post.tags}
							<div class="mt-2 flex flex-wrap gap-2">
								{#each post.tags as tag (tag)}
									<span
										class="variant-soft-surface badge font-mono font-bold tracking-wide uppercase"
									>
										{tag}
									</span>
								{/each}
							</div>
						{/if}
					</div>

					<!-- Action Column -->
					<div
						class="absolute top-8 right-8 text-surface-400 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-primary-500 group-hover:opacity-100 md:static md:block md:opacity-100"
					>
						<ArrowRightIcon size={24} weight="regular" />
					</div>
				</a>
			{:else}
				<div class="py-32 text-center">
					<p class="font-heading text-3xl font-bold text-surface-400">No articles found.</p>
				</div>
			{/each}
		</div>
	</div>
</section>
