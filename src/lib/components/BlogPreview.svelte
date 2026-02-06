<script lang="ts">
	import { resolve } from '$app/paths';
	import { reveal } from '$lib/actions';
	import ArrowRightIcon from 'phosphor-svelte/lib/ArrowRightIcon';

	interface Post {
		slug: string;
		title: string;
		description: string;
		date: string;
		tags?: string[];
	}

	let { posts = [] }: { posts: Post[] } = $props();

	function formatDate(dateStr: string) {
		if (!dateStr) return '';
		return new Intl.DateTimeFormat('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		}).format(new Date(dateStr));
	}
</script>

<section class="border-t border-surface-200-800 bg-surface-50-950 px-6 py-24">
	<div class="container mx-auto max-w-7xl">
		<div class="mb-16 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
			<div>
				<h2
					use:reveal={{ delay: 0, y: 20 }}
					class="font-heading text-5xl font-black tracking-tighter text-surface-950-50 md:text-6xl"
				>
					Writing.
				</h2>
			</div>
			<div use:reveal={{ delay: 100, y: 20 }} class="hidden md:block">
				<a href={resolve('/blog')} class="variant-soft-surface btn font-bold"> View Archive </a>
			</div>
		</div>

		<div class="flex flex-col gap-6">
			{#each posts as post, i (post.slug)}
				<a
					href={resolve(`/blog/${post.slug}`)}
					class="group bg-surface-100-800 hover:bg-surface-200-700 relative flex flex-col gap-6 rounded-xl border border-surface-200-800 p-8 transition-all hover:border-primary-500/50 md:flex-row md:items-center md:gap-12"
					use:reveal={{ delay: i * 50 }}
				>
					<!-- Date -->
					<div class="shrink-0 md:w-32">
						<time
							datetime={post.date}
							class="font-mono text-xs font-bold tracking-wider text-surface-500 uppercase"
						>
							{formatDate(post.date)}
						</time>
					</div>

					<!-- Content -->
					<div class="grow space-y-2">
						<h3
							class="font-heading text-2xl leading-tight font-bold tracking-tight text-surface-950-50 transition-colors group-hover:text-primary-500"
						>
							{post.title}
						</h3>
						{#if post.tags}
							<div class="flex flex-wrap gap-2">
								{#each post.tags as tag (tag)}
									<span class="text-xs font-medium text-surface-500">#{tag}</span>
								{/each}
							</div>
						{/if}
					</div>

					<!-- Arrow -->
					<div
						class="hidden text-surface-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary-500 md:block"
					>
						<ArrowRightIcon size={24} />
					</div>
				</a>
			{:else}
				<div class="py-12 text-center">
					<p class="font-heading text-2xl font-bold text-surface-600-400">Coming soon.</p>
				</div>
			{/each}

			<div class="mt-8 block md:hidden">
				<a href={resolve('/blog')} class="variant-soft-surface btn w-full font-bold">
					View Archive
				</a>
			</div>
		</div>
	</div>
</section>
