<script lang="ts">
	import { resolve } from '$app/paths';
	import { reveal } from '$lib/actions';
	import ArrowRight from 'phosphor-svelte/lib/ArrowRight';
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

<section class="border-border relative min-h-[30vh] w-full overflow-hidden border-b">
	<InteractiveGrid />
	<div
		class="relative z-10 container mx-auto flex h-full min-h-[30vh] flex-col justify-end px-6 pt-32 pb-12"
	>
		<div class="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
			<div>
				<h1
					use:reveal={{ delay: 0, y: 20 }}
					class="text-foreground font-heading text-6xl font-black tracking-tighter"
				>
					Writing.
				</h1>
			</div>
			<p
				use:reveal={{ delay: 100, y: 20 }}
				class="text-muted-foreground hidden max-w-xs text-right text-sm font-bold tracking-wide md:block"
			>
				Archive of thoughts <br />and technical notes.
			</p>
		</div>
	</div>
</section>

<section class="bg-background min-h-screen">
	<div class="container mx-auto max-w-5xl px-6 py-20">
		<!-- Posts Grid -->
		<ul class="grid gap-0 border-t-2 border-stone-900 dark:border-stone-100">
			{#each data.posts as post, i (post.slug)}
				<li>
					<a
						href={resolve(`/blog/${post.slug}`)}
						class="group dark:hover:bg-card block border-b-2 border-stone-900 transition-colors hover:bg-stone-50 dark:border-stone-100"
					>
						<article
							use:reveal={{ delay: i * 50 }}
							class="grid gap-8 py-12 md:grid-cols-[200px_1fr_auto] md:items-baseline md:px-6"
						>
							<!-- Date -->
							<time
								datetime={post.date}
								class="text-muted-foreground font-mono text-sm font-bold tracking-wider uppercase"
							>
								{formatDate(post.date)}
							</time>

							<!-- Content -->
							<div class="space-y-6">
								<h3
									class="text-foreground group-hover:text-muted-foreground font-heading text-3xl leading-tight font-bold tracking-tight transition-colors"
								>
									{post.title}
								</h3>
								<p class="line-clamp-2 max-w-2xl text-base leading-relaxed font-medium">
									{post.description}
								</p>
								{#if post.tags}
									<div class="flex flex-wrap gap-2">
										{#each post.tags as tag (tag)}
											<span class="text-muted-foreground font-mono text-xs font-bold">#{tag}</span>
										{/each}
									</div>
								{/if}
							</div>

							<!-- Arrow -->
							<div class="hidden md:block">
								<span class="text-foreground">
									<ArrowRight size={32} weight="light" />
								</span>
							</div>
						</article>
					</a>
				</li>
			{:else}
				<li class="py-32 text-center">
					<p class="font-heading text-3xl font-bold text-muted-foreground">No articles found.</p>
				</li>
			{/each}
		</ul>
	</div>
</section>
