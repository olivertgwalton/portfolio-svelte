<script lang="ts">
	import { resolve } from '$app/paths';
	import { reveal } from '$lib/actions';
	import { getHSL, dateFormatter } from '$lib/utils';
	import ArrowRightIcon from 'phosphor-svelte/lib/ArrowRightIcon';
	import ArrowSquareOutIcon from 'phosphor-svelte/lib/ArrowSquareOutIcon';
	import CodeIcon from 'phosphor-svelte/lib/CodeIcon';
	import type { ContentMetadata } from '$lib/content';
	import { getEnhancedImage } from '$lib/images';

	let { projects = [], posts = [] } = $props<{
		projects: ContentMetadata[];
		posts: ContentMetadata[];
	}>();

	let activeTab = $state<'projects' | 'posts'>('projects');

	const items = $derived(activeTab === 'projects' ? projects : posts);
</script>

<section class="border-t border-surface-200-800/80 bg-surface-50-950 py-24 md:py-32">
	<div class="container mx-auto max-w-7xl px-6">
		<div class="mb-12 space-y-6">
			<h2
				use:reveal={{ delay: 0 }}
				class="font-heading text-5xl font-black tracking-tighter text-surface-950-50 md:text-6xl"
			>
				Selected Work.
			</h2>

			<div use:reveal={{ delay: 100 }} class="flex items-center justify-between gap-4">
				<!-- Tabs -->
				<div class="flex flex-wrap gap-2">
					<button
						onclick={() => (activeTab = 'projects')}
						class="rounded-full px-5 py-2.5 font-mono text-xs font-bold tracking-wider uppercase transition-all
							{activeTab === 'projects'
							? 'bg-primary-500 text-white'
							: 'bg-surface-200-700 hover:bg-surface-300-600 text-surface-600-400 hover:text-surface-950-50'}"
					>
						Projects
					</button>
					<button
						onclick={() => (activeTab = 'posts')}
						class="rounded-full px-5 py-2.5 font-mono text-xs font-bold tracking-wider uppercase transition-all
							{activeTab === 'posts'
							? 'bg-primary-500 text-white'
							: 'bg-surface-200-700 hover:bg-surface-300-600 text-surface-600-400 hover:text-surface-950-50'}"
					>
						Writing
					</button>
				</div>

				<a
					href={resolve('/(public)/[collection=collection]', {
						collection: activeTab === 'projects' ? 'projects' : 'blog'
					})}
					class="shrink-0 text-[10px] font-black tracking-widest text-surface-500 uppercase transition-colors hover:text-primary-500"
				>
					View All {activeTab === 'projects' ? 'Projects' : 'Posts'}
				</a>
			</div>
		</div>

		<div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
			{#each items as item, i (item.slug)}
				{@const img = getEnhancedImage(item.image)}
				{@const isProject = activeTab === 'projects'}
				{@const collection = isProject ? 'projects' : 'blog'}

				<div
					use:reveal={{ delay: 150 + i * 75 }}
					class="group bg-surface-100-800 hover:bg-surface-200-700 relative flex flex-col overflow-hidden rounded-3xl border border-surface-200-800 transition-all hover:-translate-y-1 hover:border-primary-500/80 {i >=
					3
						? 'hidden sm:flex'
						: ''}"
				>
					{#if img}
						<div class="h-48 w-full overflow-hidden">
							<enhanced:img
								src={img}
								alt={item.title}
								sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
								class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
							/>
						</div>
					{:else if item.image}
						<div class="h-48 w-full overflow-hidden">
							<img
								src={item.image}
								alt={item.title}
								class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
							/>
						</div>
					{:else}
						<div
							class="flex h-48 items-center justify-center bg-grid-paper opacity-30 transition-opacity group-hover:opacity-60"
							style="background-color: {getHSL(item.title)};"
						>
							<div class="from-surface-100-800 h-full w-full bg-linear-to-t to-transparent"></div>
							{#if isProject}
								<CodeIcon size={48} weight="thin" class="absolute text-surface-400" />
							{/if}
						</div>
					{/if}

					<div class="flex grow flex-col p-8">
						<div class="mb-4 flex items-center justify-between">
							{#if isProject && item.type}
								<span class="font-mono text-xs font-bold tracking-wider text-primary-500 uppercase">
									{item.type}
								</span>
							{:else}
								<time class="font-mono text-xs font-bold tracking-wider text-surface-500 uppercase"
									>{dateFormatter.format(new Date(item.date))}</time
								>
							{/if}
						</div>

						<a
							href={resolve('/(public)/[collection=collection]/[slug]', {
								collection,
								slug: item.slug
							})}
						>
							<h3
								class="mb-4 font-heading text-2xl leading-tight font-bold tracking-tight text-surface-950-50 transition-colors group-hover:text-primary-500"
							>
								{item.title}
							</h3>
						</a>

						<p class="mb-6 line-clamp-3 grow text-base leading-relaxed text-surface-600-400">
							{item.description}
						</p>

						<div class="flex items-center justify-between border-t border-surface-200-800 pt-6">
							<div class="flex flex-wrap gap-2">
								{#if isProject && item.tech}
									{#each item.tech.slice(0, 3) as t (t)}<span
											class="text-xs font-bold tracking-wide text-surface-500 uppercase">{t}</span
										>{/each}
									{#if item.tech.length > 3}<span class="text-xs font-bold text-surface-500"
											>+{item.tech.length - 3}</span
										>{/if}
								{:else if !isProject && item.tags}
									{#each item.tags.slice(0, 3) as t (t)}<span
											class="text-xs font-bold tracking-wide text-surface-500 uppercase">#{t}</span
										>{/each}
								{/if}
							</div>

							<div class="flex items-center gap-4">
								{#if isProject && item.demo}
									<a
										href={item.demo}
										target="_blank"
										rel="external noopener noreferrer"
										class="text-surface-400 transition-colors hover:text-primary-500"
										title="Live Demo"
									>
										<ArrowSquareOutIcon size={20} />
									</a>
								{/if}
								<a
									href={resolve('/(public)/[collection=collection]/[slug]', {
										collection,
										slug: item.slug
									})}
									class="text-surface-400 transition-transform duration-300 group-hover:translate-x-1 hover:text-primary-500"
									aria-label="View {isProject ? 'project' : 'post'}: {item.title}"
								>
									<ArrowRightIcon size={20} />
								</a>
							</div>
						</div>
					</div>
				</div>
			{:else}
				<div class="col-span-full py-16 text-center">
					<p class="font-heading text-2xl font-bold text-surface-800-200">
						No {activeTab === 'projects' ? 'projects' : 'posts'} found.
					</p>
				</div>
			{/each}
		</div>
	</div>
</section>
