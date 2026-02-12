<script lang="ts">
	import { resolve } from '$app/paths';
	import { dateFormatter } from '$lib/utils';
	import { reveal } from '$lib/actions';
	import MetaTags from '$lib/components/MetaTags.svelte';
	import TableOfContents from '$lib/components/TableOfContents.svelte';
	import ScrollProgress from '$lib/components/ScrollProgress.svelte';
	import ShareWidget from '$lib/components/ShareWidget.svelte';
	import type { Component } from 'svelte';
	import {
		ArrowLeftIcon,
		GithubLogoIcon,
		GlobeIcon,
		CalendarIcon,
		TagIcon,
		ClockIcon
	} from 'phosphor-svelte';
	import type { ContentMetadata, ContentType } from '$lib/content';

	import { getEnhancedImage } from '$lib/images';

	let {
		meta,
		slug,
		type,
		related = []
	}: { meta: ContentMetadata; slug: string; type: ContentType; related?: ContentMetadata[] } =
		$props();

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
	const ogImage = $derived(
		`/api/og?title=${encodeURIComponent(meta.title)}&description=${encodeURIComponent(meta.description)}`
	);
</script>

<MetaTags
	title={meta.title}
	description={meta.description}
	type={isProject ? 'website' : 'article'}
	image={ogImage}
/>

<ScrollProgress />

<article class="bg-surface-50-950 pb-32">
	<header class="border-b border-surface-200-800/80 pt-32 pb-16">
		<div class="container mx-auto max-w-7xl px-6">
			<a
				use:reveal={{ delay: 0, y: 10 }}
				href={resolve('/(public)/[collection=collection]', {
					collection: isProject ? 'projects' : 'blog'
				})}
				class="mb-8 inline-flex items-center gap-2 text-sm font-bold text-surface-600-400 hover:text-primary-500"
			>
				<ArrowLeftIcon size={16} /> BACK TO {isProject ? 'PROJECTS' : 'BLOG'}
			</a>

			<div class="grid gap-12 lg:grid-cols-[1fr_auto] lg:items-center">
				<div class="max-w-3xl">
					{#if meta.type}
						<span
							class="mb-4 block font-mono text-sm font-bold tracking-widest text-primary-500 uppercase"
						>
							{meta.type}
						</span>
					{:else if !isProject}
						<span
							class="mb-4 block font-mono text-sm font-bold tracking-widest text-primary-500 uppercase"
						>
							Blog Post
						</span>
					{/if}
					<h1
						class="font-heading text-5xl font-black tracking-tighter text-surface-950-50 md:text-7xl"
					>
						{meta.title}
					</h1>
					<p class="mt-6 text-xl leading-relaxed text-surface-800-200">
						{meta.description}
					</p>

					<div class="mt-8 flex flex-wrap gap-x-8 gap-y-4 text-sm text-surface-600-400">
						<div class="flex items-center gap-2">
							<CalendarIcon size={18} />
							<span class="font-bold">{dateFormatter.format(new Date(meta.date))}</span>
						</div>
						{#if meta.readTime}
							<div class="flex items-center gap-2">
								<ClockIcon size={18} />
								<span class="font-bold">{meta.readTime}</span>
							</div>
						{/if}
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
						{#if isProject}
							{#if meta.demo}
								<a
									href={meta.demo}
									target="_blank"
									rel="external noreferrer"
									class="flex items-center gap-2 font-bold transition-colors hover:text-primary-500"
								>
									<GlobeIcon size={18} /> Live Demo
								</a>
							{/if}
							{#if meta.source}
								<a
									href={meta.source}
									target="_blank"
									rel="external noreferrer"
									class="flex items-center gap-2 font-bold transition-colors hover:text-primary-500"
								>
									<GithubLogoIcon size={18} /> Source Code
								</a>
							{/if}
						{/if}
					</div>
				</div>

				{#if meta.image}
					<div
						class="aspect-video w-full max-w-xl overflow-hidden rounded-3xl border border-surface-200-800 shadow-2xl"
					>
						{#if featuredImage}
							<enhanced:img
								src={featuredImage}
								alt={meta.title}
								fetchpriority="high"
								loading="eager"
								class="h-full w-full object-cover"
							/>
						{:else}
							<img
								src={meta.image}
								alt={meta.title}
								fetchpriority="high"
								loading="eager"
								class="h-full w-full object-cover"
							/>
						{/if}
					</div>
				{/if}
			</div>
		</div>
	</header>

	<div class="container mx-auto max-w-7xl px-4 pt-20 md:px-6">
		<div class="grid gap-16 lg:grid-cols-[1fr_240px]">
			<div
				class="prose prose-sm w-full max-w-none sm:prose-base md:prose-lg dark:prose-invert prose-headings:font-heading prose-headings:font-black prose-headings:text-surface-950-50 prose-p:text-surface-800-200 prose-a:text-primary-600 dark:prose-a:text-primary-400 prose-strong:text-surface-950-50 prose-code:font-mono prose-code:text-primary-700 dark:prose-code:text-primary-400 prose-li:text-surface-800-200"
			>
				<div>
					<TableOfContents layout="collapsible" />
				</div>
				{#if ContentComponent}
					<ContentComponent />
					<ShareWidget title={meta.title} />
				{:else}
					<p class="animate-pulse font-bold text-surface-400">Loading...</p>
				{/if}
			</div>
			<aside class="hidden lg:block">
				<div class="sticky top-8">
					<TableOfContents />
				</div>
			</aside>
		</div>

		{#if related.length > 0}
			<section class="mt-16 border-t border-surface-200-800 pt-12">
				<h2 class="font-heading text-2xl font-black tracking-tight text-surface-950-50">
					Related {isProject ? 'Projects' : 'Posts'}
				</h2>
				<div class="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{#each related as item (item.slug)}
						<a
							href={resolve('/(public)/[collection=collection]/[slug]', {
								collection: isProject ? 'projects' : 'blog',
								slug: item.slug
							})}
							class="group rounded-xl border border-surface-200-800 p-5 transition-colors hover:border-primary-500/50 hover:bg-surface-100-900"
						>
							<h3
								class="font-heading text-lg font-bold text-surface-950-50 group-hover:text-primary-500"
							>
								{item.title}
							</h3>
							<p class="mt-2 line-clamp-2 text-sm text-surface-600-400">
								{item.description}
							</p>
							<div class="mt-3 flex items-center gap-3 text-xs text-surface-500">
								<span>{dateFormatter.format(new Date(item.date))}</span>
								{#if item.tags?.length || item.tech?.length}
									<span class="text-surface-300-700">&middot;</span>
									<div class="flex flex-wrap gap-1">
										{#each (item.tags ?? item.tech ?? []).slice(0, 3) as tag (tag)}
											<span
												class="rounded-full border border-surface-200-800 px-2 py-0.5 text-[10px] font-bold uppercase"
											>
												{tag}
											</span>
										{/each}
									</div>
								{/if}
							</div>
						</a>
					{/each}
				</div>
			</section>
		{/if}
	</div>
</article>
