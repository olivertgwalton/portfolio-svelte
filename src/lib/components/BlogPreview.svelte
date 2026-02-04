<script lang="ts">
	import { resolve } from '$app/paths';
	import { reveal } from '$lib/actions';
	import ArrowRight from 'phosphor-svelte/lib/ArrowRight';

	interface Post {
		id: number;
		title: string;
		slug: string;
		excerpt: string | null;
		publishedAt: Date | null;
	}

	let { posts = [] }: { posts: Post[] } = $props();

	function formatDate(date: Date | null) {
		if (!date) return '';
		return new Intl.DateTimeFormat('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		}).format(date);
	}
</script>

<section class="border-t border-border px-6 py-32 dark:border-stone-800">
	<div class="relative z-10 container mx-auto max-w-7xl">
		<div class="mb-20 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
			<div>
				<h2
					use:reveal={{ delay: 0, y: 20 }}
					class="font-heading text-5xl font-black tracking-tighter text-primary md:text-6xl dark:text-white"
				>
					Writing.
				</h2>
			</div>
			<p
				use:reveal={{ delay: 100, y: 20 }}
				class="hidden max-w-xs text-right text-sm font-bold tracking-wide text-secondary md:block dark:text-muted"
			>
				Thoughts on code, design, <br />and the future of the web.
			</p>
		</div>

		<ul class="grid gap-0 border-t-2 border-black dark:border-white">
			{#each posts as post, i (post.id)}
				<li>
					<a
						href={resolve(`/blog/${post.slug}`)}
						class="group block border-b-2 border-black transition-colors hover:bg-stone-50 dark:border-white dark:hover:bg-surface"
					>
						<article
							use:reveal={{ delay: i * 100 }}
							class="grid gap-8 py-12 md:grid-cols-[200px_1fr_auto] md:items-baseline md:px-6"
						>
							<!-- Date -->
							<time
								datetime={post.publishedAt ? new Date(post.publishedAt).toISOString() : ''}
								class="font-mono text-sm font-bold tracking-wider text-secondary uppercase dark:text-muted"
							>
								{formatDate(post.publishedAt ? new Date(post.publishedAt) : null)}
							</time>

							<!-- Content -->
							<div class="space-y-6">
								<h3
									class="font-heading text-3xl leading-tight font-bold tracking-tight text-primary transition-colors group-hover:text-secondary md:text-3xl dark:text-white dark:group-hover:text-stone-300"
								>
									{post.title}
								</h3>
								<p
									class="line-clamp-2 max-w-2xl text-base leading-relaxed font-medium text-secondary"
								>
									{post.excerpt}
								</p>
							</div>

							<!-- Arrow -->
							<div class="hidden md:block">
								<span
									class="text-primary transition-transform duration-300 group-hover:translate-x-4 dark:text-white"
								>
									<ArrowRight size={32} weight="light" />
								</span>
							</div>
						</article>
					</a>
				</li>
			{:else}
				<li class="py-32 text-center">
					<p class="font-heading text-3xl font-bold text-muted">Coming soon.</p>
				</li>
			{/each}
		</ul>
	</div>
</section>
