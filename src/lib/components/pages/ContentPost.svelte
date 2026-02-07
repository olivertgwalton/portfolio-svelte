<script lang="ts">
	import { resolve } from '$app/paths';
	import { dateFormatter } from '$lib/utils';
	import { reveal } from '$lib/actions';
	import MetaTags from '$lib/components/MetaTags.svelte';
	import TableOfContents from '$lib/components/TableOfContents.svelte';
	import type { Component } from 'svelte';
	import { ArrowLeftIcon, GithubLogoIcon, GlobeIcon, CalendarIcon, TagIcon } from 'phosphor-svelte';
	import type { ContentMetadata, ContentType } from '$lib/content';

	import { getEnhancedImage } from '$lib/images';

	let { meta, slug, type }: { meta: ContentMetadata; slug: string; type: ContentType } = $props();

	let ContentComponent = $state<Component | null>(null);
	// Unified directory-based structure: src/lib/posts/[slug]/index.md
	const postModules = import.meta.glob('/src/lib/posts/**/index.md');
	const projectModules = import.meta.glob('/src/lib/projects/**/index.md');

	$effect(() => {
		const modules = type === 'posts' ? postModules : projectModules;
		const baseDir = `/src/lib/${type === 'posts' ? 'posts' : 'projects'}`;

		const path = `${baseDir}/${slug}/index.md`;
		modules[path]?.().then((m) => (ContentComponent = (m as { default: Component }).default));
	});

	const isProject = $derived(type === 'projects');
	const featuredImage = $derived(getEnhancedImage(meta.image));
</script>

<MetaTags
	title={meta.title}
	description={meta.description}
	type={isProject ? 'website' : 'article'}
/>

<article class="bg-surface-50-950 pb-32">
	<header class="border-b border-surface-200-800/80 pt-32 pb-16">
		<div class="container mx-auto max-w-7xl px-6">
			<a
				use:reveal={{ delay: 0, y: 10 }}
				href={resolve('/(public)/[collection=collection]', {
					collection: isProject ? 'projects' : 'blog'
				})}
				class="mb-8 inline-flex items-center gap-2 text-sm font-bold text-surface-500 hover:text-primary-500"
			>
				<ArrowLeftIcon size={16} /> BACK TO {isProject ? 'PROJECTS' : 'BLOG'}
			</a>

			<div class="grid gap-12 lg:grid-cols-[1fr_auto] lg:items-center">
				<div class="max-w-3xl">
					{#if meta.type}
						<span
							use:reveal={{ delay: 100 }}
							class="mb-4 block font-mono text-sm font-bold tracking-widest text-primary-500 uppercase"
						>
							{meta.type}
						</span>
					{:else if !isProject}
						<span
							use:reveal={{ delay: 100 }}
							class="mb-4 block font-mono text-sm font-bold tracking-widest text-primary-500 uppercase"
						>
							Blog Post
						</span>
					{/if}
					<h1
						use:reveal={{ delay: 150 }}
						class="font-heading text-5xl font-black tracking-tighter text-surface-950-50 md:text-7xl"
					>
						{meta.title}
					</h1>
					<p use:reveal={{ delay: 200 }} class="mt-6 text-xl leading-relaxed text-surface-800-200">
						{meta.description}
					</p>

					<div
						use:reveal={{ delay: 200, y: 15 }}
						class="mt-8 flex flex-wrap gap-6 text-sm text-surface-700-300"
					>
						<div class="flex items-center gap-2">
							<CalendarIcon size={18} />
							<span class="font-bold">{dateFormatter.format(new Date(meta.date))}</span>
						</div>
						{#if isProject && meta.tech}
							<div class="flex items-center gap-2">
								<TagIcon size={18} />
								<div class="flex flex-wrap gap-2">
									{#each meta.tech as t (t)}
										<span
											class="rounded-full border border-surface-200-800 px-2.5 py-1 text-[10px] font-bold uppercase"
										>
											{t}
										</span>
									{/each}
								</div>
							</div>
						{/if}
					</div>

					{#if isProject && (meta.demo || meta.github)}
						<div use:reveal={{ delay: 250, y: 15 }} class="mt-10 flex flex-wrap gap-4">
							{#if meta.demo}
								<a
									href={meta.demo}
									target="_blank"
									rel="external noreferrer"
									class="variant-filled-primary btn font-bold uppercase"
								>
									<GlobeIcon size={18} class="mr-2" /> LIVE DEMO
								</a>
							{/if}
							{#if meta.github}
								<a
									href={meta.github}
									target="_blank"
									rel="external noreferrer"
									class="variant-soft btn font-bold uppercase"
								>
									<GithubLogoIcon size={18} class="mr-2" /> SOURCE CODE
								</a>
							{/if}
						</div>
					{/if}
				</div>

				{#if meta.image}
					<div
						use:reveal={{ delay: 300, y: 20 }}
						class="aspect-video w-full max-w-xl overflow-hidden rounded-3xl border border-surface-200-800 shadow-2xl"
					>
						{#if featuredImage}
							<enhanced:img
								src={featuredImage}
								alt={meta.title}
								class="h-full w-full object-cover"
							/>
						{:else}
							<img src={meta.image} alt={meta.title} class="h-full w-full object-cover" />
						{/if}
					</div>
				{/if}
			</div>
		</div>
	</header>

	<div class="container mx-auto max-w-7xl px-4 pt-20 md:px-6">
		<div class="grid gap-16 lg:grid-cols-[1fr_240px]">
			<div
				use:reveal={{ delay: 350, y: 20 }}
				class="prose prose-sm w-full max-w-none sm:prose-base md:prose-lg dark:prose-invert prose-headings:font-heading prose-headings:font-black prose-headings:text-surface-950-50 prose-p:text-surface-800-200 prose-a:text-primary-500 prose-strong:text-surface-950-50 prose-code:text-primary-400 prose-li:text-surface-800-200"
			>
				{#if !isProject}
					<div use:reveal={{ delay: 400, y: 15 }}>
						<TableOfContents layout="collapsible" />
					</div>
				{/if}
				{#if ContentComponent}
					<ContentComponent />
				{:else}
					<p class="animate-pulse font-bold text-surface-400">Loading...</p>
				{/if}
			</div>
			<aside class="hidden lg:block">
				<div use:reveal={{ delay: 450, y: 15 }} class="sticky top-8">
					<TableOfContents />
				</div>
			</aside>
		</div>
	</div>
</article>
