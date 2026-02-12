<script lang="ts">
	import { resolve } from '$app/paths';
	import { reveal } from '$lib/actions';
	import { getHSL } from '$lib/utils';
	import ArrowRightIcon from 'phosphor-svelte/lib/ArrowRightIcon';
	import CodeIcon from 'phosphor-svelte/lib/CodeIcon';
	import type { ContentMetadata } from '$lib/content';

	import { getEnhancedImage } from '$lib/images';

	let { projects = [] }: { projects: ContentMetadata[] } = $props();
</script>

<section class="border-t border-surface-200-800/80 bg-surface-50-950 py-32">
	<div class="container mx-auto max-w-7xl px-6">
		<div class="mb-16 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
			<div>
				<h2
					use:reveal={{ delay: 0 }}
					class="font-heading text-5xl font-black tracking-tighter text-surface-950-50 md:text-6xl"
				>
					Projects.
				</h2>
			</div>
			<div class="hidden md:block">
				<div use:reveal={{ delay: 100 }}>
					<a
						href={resolve('/(public)/[collection=collection]', { collection: 'projects' })}
						class="variant-soft-surface btn font-bold">View All Projects</a
					>
				</div>
			</div>
		</div>

		<div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
			{#each projects as project, i (project.slug)}
				{@const img = getEnhancedImage(project.image)}
				<a
					href={resolve('/(public)/[collection=collection]/[slug]', {
						collection: 'projects',
						slug: project.slug
					})}
					use:reveal={{ delay: 150 + i * 75 }}
					class="group bg-surface-100-800 hover:bg-surface-200-700 relative flex flex-col overflow-hidden rounded-3xl border border-surface-200-800 transition-all hover:-translate-y-1 hover:border-primary-500/80"
				>
					{#if img}
						<div class="h-48 w-full overflow-hidden">
							<enhanced:img
								src={img}
								alt={project.title}
								sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
								class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
							/>
						</div>
					{:else if project.image}
						<div class="h-48 w-full overflow-hidden">
							<img
								src={project.image}
								alt={project.title}
								class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
							/>
						</div>
					{:else}
						<div
							class="flex h-48 items-center justify-center bg-grid-paper opacity-30 transition-opacity group-hover:opacity-60"
							style="background-color: {getHSL(project.title)};"
						>
							<div class="from-surface-100-800 h-full w-full bg-linear-to-t to-transparent"></div>
							<span aria-hidden="true"><CodeIcon size={48} weight="thin" class="absolute text-surface-400" /></span>
						</div>
					{/if}

					<div class="flex grow flex-col p-8">
						{#if project.type}
							<span
								class="mb-4 block font-mono text-xs font-bold tracking-wider text-primary-500 uppercase"
							>
								{project.type}
							</span>
						{/if}
						<h3
							class="mb-4 font-heading text-2xl leading-tight font-bold tracking-tight text-surface-950-50 transition-colors group-hover:text-primary-500"
						>
							{project.title}
						</h3>
						<p class="mb-6 line-clamp-3 grow text-base leading-relaxed text-surface-800-200">
							{project.description}
						</p>
						<div class="flex items-center justify-between border-t border-surface-200-800 pt-6">
							<div class="flex flex-wrap gap-2">
								{#if project.tech}{#each project.tech.slice(0, 3) as t (t)}<span
											class="text-xs font-bold tracking-wide text-surface-500 uppercase">{t}</span
										>{/each}{#if project.tech.length > 3}<span
											class="text-xs font-bold text-surface-500">+ {project.tech.length - 3}</span
										>{/if}{/if}
							</div>
							<div
								class="text-surface-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary-500"
								aria-label="View project: {project.title}"
							>
								<span aria-hidden="true"><ArrowRightIcon size={20} /></span>
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
					href={resolve('/(public)/[collection=collection]', { collection: 'projects' })}
					class="variant-soft-surface btn w-full font-bold">View All Projects</a
				>
			</div>
		</div>
	</div>
</section>
