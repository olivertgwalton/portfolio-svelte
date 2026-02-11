<script lang="ts">
	import { resolve } from '$app/paths';
	import { reveal } from '$lib/actions';
	import { dateFormatter, getHSL } from '$lib/utils';
	import ArrowRightIcon from 'phosphor-svelte/lib/ArrowRightIcon';
	import type { ContentMetadata } from '$lib/content';

	import { getEnhancedImage } from '$lib/images';

	let { posts = [] }: { posts: ContentMetadata[] } = $props();
</script>

<section class="border-t border-surface-200-800/80 bg-surface-50-950 py-32">
	<div class="container mx-auto max-w-7xl px-6">
		<div class="mb-16 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
			<div>
				<h2
					use:reveal={{ delay: 0 }}
					class="font-heading text-5xl font-black tracking-tighter text-surface-950-50 md:text-6xl"
				>
					Blog.
				</h2>
			</div>
			<div class="hidden md:block">
				<div use:reveal={{ delay: 100 }}>
					<a
						href={resolve('/(public)/[collection=collection]', { collection: 'blog' })}
						class="variant-soft-surface btn font-bold">View Archive</a
					>
				</div>
			</div>
		</div>

		<div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
			{#each posts as post, i (post.slug)}
				{@const img = getEnhancedImage(post.image)}
				<a
					href={resolve('/(public)/[collection=collection]/[slug]', {
						collection: 'blog',
						slug: post.slug
					})}
					use:reveal={{ delay: 150 + i * 75 }}
					class="group bg-surface-100-800 hover:bg-surface-200-700 relative flex flex-col overflow-hidden rounded-3xl border border-surface-200-800 transition-all hover:-translate-y-1 hover:border-primary-500/80"
				>
					{#if img}
						<div class="h-48 w-full overflow-hidden">
							<enhanced:img
								src={img}
								alt={post.title}
								class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
							/>
						</div>
					{:else if post.image}
						<div class="h-48 w-full overflow-hidden">
							<img
								src={post.image}
								alt={post.title}
								class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
							/>
						</div>
					{:else}
						<div
							class="h-48 w-full bg-grid-paper opacity-30 transition-opacity group-hover:opacity-60"
							style="background-color: {getHSL(post.title)};"
						>
							<div class="from-surface-100-800 h-full w-full bg-linear-to-t to-transparent"></div>
						</div>
					{/if}

					<div class="flex grow flex-col p-8">
						<time
							class="mb-4 block font-mono text-xs font-bold tracking-wider text-surface-600-400 uppercase"
							>{dateFormatter.format(new Date(post.date))}</time
						>
						<h3
							class="mb-4 font-heading text-2xl leading-tight font-bold tracking-tight text-surface-950-50 transition-colors group-hover:text-primary-500"
						>
							{post.title}
						</h3>
						<p class="mb-6 line-clamp-3 grow text-base leading-relaxed text-surface-600-400">
							{post.description}
						</p>
						<div class="flex items-center justify-between border-t border-surface-200-800 pt-6">
							<div class="flex flex-wrap gap-2">
								{#if post.tags}{#each post.tags.slice(0, 2) as tag (tag)}<span
											class="text-xs font-bold tracking-wide text-surface-500 uppercase"
											>#{tag}</span
										>{/each}{#if post.tags.length > 2}<span
											class="text-xs font-bold text-surface-500">+ {post.tags.length - 2}</span
										>{/if}{/if}
							</div>
							<div
								class="text-surface-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary-500"
							>
								<ArrowRightIcon size={20} />
							</div>
						</div>
					</div>
				</a>
			{:else}
				<div class="col-span-full py-16 text-center">
					<p class="font-heading text-2xl font-bold text-surface-800-200">Coming soon.</p>
				</div>
			{/each}
		</div>

		<div class="mt-10 block md:hidden">
			<div use:reveal={{ delay: 300 }}>
				<a
					href={resolve('/(public)/[collection=collection]', { collection: 'blog' })}
					class="variant-soft-surface btn w-full font-bold">View Archive</a
				>
			</div>
		</div>
	</div>
</section>
