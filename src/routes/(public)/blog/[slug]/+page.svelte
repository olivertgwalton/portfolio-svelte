<script lang="ts">
	import { formatDate } from '$lib/utils';
	import MetaTags from '$lib/components/MetaTags.svelte';
	import TableOfContents from '$lib/components/TableOfContents.svelte';
	import type { Component } from 'svelte';
	import { ArrowLeftIcon, CalendarBlankIcon, TagIcon } from 'phosphor-svelte';
	import { resolve } from '$app/paths';
	import { fly } from 'svelte/transition';
	import { onMount } from 'svelte';

	interface Props {
		data: {
			meta: {
				title: string;
				description: string;
				date: string;
				tags?: string[];
			};
			slug: string;
		};
	}

	let { data }: Props = $props();
	let ready = $state(false);

	onMount(() => {
		ready = true;
	});

	// Dynamically import the markdown component
	let PostComponent = $state<Component | null>(null);

	$effect(() => {
		if (data.slug) {
			import(`../../../../lib/posts/${data.slug}.md`).then((m) => {
				PostComponent = m.default;
			});
		}
	});
</script>

<MetaTags title={data.meta.title} description={data.meta.description} type="article" />

<div class="min-h-screen bg-surface-50-950 pb-24">
	<div class="container mx-auto max-w-6xl px-6 py-12 lg:py-24">
		<!-- Back Link -->
		{#if ready}
			<a
				href={resolve('/blog')}
				in:fly={{ y: 10, duration: 600, delay: 0 }}
				class="group mb-12 inline-flex items-center gap-2 text-sm font-bold text-surface-500 transition-colors hover:text-primary-500"
			>
				<ArrowLeftIcon class="size-4 transition-transform group-hover:-translate-x-1" />
				BACK TO BLOG
			</a>
		{/if}

		<article>
			<header class="mb-16 border-b border-surface-200-800 pb-16">
				{#if ready}
					<!-- Meta Top -->
					<div
						class="mb-6 flex flex-wrap items-center gap-6 text-sm"
						in:fly={{ y: 10, duration: 600, delay: 100 }}
					>
						<div class="flex items-center gap-2 text-surface-500">
							<CalendarBlankIcon class="size-4" />
							<time datetime={data.meta.date} class="font-mono font-bold uppercase tracking-wider"
								>{formatDate(data.meta.date)}</time
							>
						</div>
						{#if data.meta.tags}
							<div class="flex items-center gap-3">
								<TagIcon class="size-4 text-surface-500" />
								<div class="flex gap-2">
									{#each data.meta.tags as tag (tag)}
										<span
											class="variant-soft-surface badge font-mono font-bold tracking-wide uppercase"
										>
											{tag}
										</span>
									{/each}
								</div>
							</div>
						{/if}
					</div>

					<!-- Title -->
					<h1
						in:fly={{ y: 20, duration: 600, delay: 200 }}
						class="max-w-4xl font-heading text-4xl leading-[1.1] font-black tracking-tighter text-surface-950-50 sm:text-6xl md:text-7xl"
					>
						{data.meta.title}
					</h1>

					<!-- Description -->
					<p
						in:fly={{ y: 20, duration: 600, delay: 300 }}
						class="mt-8 max-w-2xl text-xl leading-relaxed font-medium text-surface-600-400"
					>
						{data.meta.description}
					</p>
				{/if}
			</header>

			{#if ready}
				<div
					class="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_200px] xl:grid-cols-[1fr_240px]"
					in:fly={{ y: 20, duration: 600, delay: 400 }}
				>
					<div
						class="prose-pre:bg-surface-900-50 prose-pre:text-surface-50-900 prose prose-lg
                    max-w-none dark:prose-invert prose-headings:font-heading prose-headings:font-bold
                    prose-headings:tracking-tight prose-headings:text-surface-950-50
                    prose-p:leading-relaxed prose-p:text-surface-700-300
                    prose-a:font-medium prose-a:text-primary-500 prose-a:no-underline hover:prose-a:text-primary-600
                    prose-strong:font-bold prose-strong:text-surface-950-50 prose-code:rounded prose-code:bg-surface-200-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:font-mono prose-code:text-sm prose-code:font-bold prose-code:text-primary-500
                    prose-code:before:content-none prose-code:after:content-none prose-pre:rounded-xl prose-pre:border prose-pre:border-surface-200-800
                    					prose-img:rounded-2xl prose-img:border prose-img:border-surface-200-800"
					>
						<!-- Mobile TOC -->
						<TableOfContents layout="collapsible" />

						{#if PostComponent}
							<PostComponent />
						{:else}
							<div class="flex h-32 items-center justify-center">
								<p class="animate-pulse font-bold text-surface-400">Loading content...</p>
							</div>
						{/if}
					</div>

					<aside class="hidden lg:block">
						<div class="sticky top-8">
							<TableOfContents />
						</div>
					</aside>
				</div>
			{/if}
		</article>
	</div>
</div>
