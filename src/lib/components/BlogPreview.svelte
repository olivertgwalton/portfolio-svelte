<script lang="ts">
	import { resolve } from '$app/paths';
	import { reveal } from '$lib/actions';
	import ArrowRightIcon from 'phosphor-svelte/lib/ArrowRightIcon';

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

<section class="border-t border-surface-200-800 px-6 py-32">
	<div class="relative z-10 container mx-auto max-w-7xl">
		<div class="mb-20 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
			<div>
				<h2
					use:reveal={{ delay: 0, y: 20 }}
					class="font-heading text-5xl font-black tracking-tighter text-surface-950-50 md:text-6xl"
				>
					Writing.
				</h2>
			</div>
			<p
				use:reveal={{ delay: 100, y: 20 }}
				class="hidden max-w-xs text-right text-sm font-bold tracking-wide text-surface-600-400 md:block"
			>
				Thoughts on code, design, <br />and the future of the web.
			</p>
		</div>

		<ul class="grid gap-0 border-t-2 border-surface-950-50">
			{#each posts as post, i (post.id)}
				<li>
					<a
						href={resolve(`/blog/${post.slug}`)}
						class="group block border-b-2 border-surface-950-50 transition-colors hover:bg-surface-100-900"
					>
						<article
							use:reveal={{ delay: i * 100 }}
							class="grid gap-8 py-12 md:grid-cols-[200px_1fr_auto] md:items-baseline md:px-6"
						>
							<!-- Date -->
							<time
								datetime={post.publishedAt ? new Date(post.publishedAt).toISOString() : ''}
								class="font-mono text-sm font-bold tracking-wider text-surface-600-400 uppercase"
							>
								{formatDate(post.publishedAt ? new Date(post.publishedAt) : null)}
							</time>

							<!-- Content -->
							<div class="space-y-6">
								<h3
									class="font-heading text-3xl leading-tight font-bold tracking-tight text-surface-950-50 transition-colors group-hover:text-surface-600-400 md:text-3xl"
								>
									{post.title}
								</h3>
								<p
									class="line-clamp-2 max-w-2xl text-base leading-relaxed font-medium text-surface-600-400"
								>
									{post.excerpt}
								</p>
							</div>

							<!-- Arrow -->
							<div class="hidden md:block">
								<span
									class="text-surface-950-50 transition-transform duration-300 group-hover:translate-x-4"
								>
									<ArrowRightIcon size={32} weight="light" />
								</span>
							</div>
						</article>
					</a>
				</li>
			{:else}
				<li class="py-32 text-center">
					<p class="font-heading text-3xl font-bold text-surface-600-400">Coming soon.</p>
				</li>
			{/each}
		</ul>
	</div>
</section>
