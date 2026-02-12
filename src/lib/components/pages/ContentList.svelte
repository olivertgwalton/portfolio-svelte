<script lang="ts">
	import { resolve } from '$app/paths';
	import { reveal } from '$lib/actions';
	import { dateFormatter, getHSL } from '$lib/utils';
	import ArrowRightIcon from 'phosphor-svelte/lib/ArrowRightIcon';
	import MagnifyingGlassIcon from 'phosphor-svelte/lib/MagnifyingGlassIcon';
	import XIcon from 'phosphor-svelte/lib/XIcon';
	import CodeIcon from 'phosphor-svelte/lib/CodeIcon';
	import InteractiveGrid from '$lib/components/visuals/InteractiveGrid.svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import type { ContentMetadata, ContentType } from '$lib/content';

	import { onMount } from 'svelte';

	let { items, type }: { items: ContentMetadata[]; type: ContentType } = $props();

	const isPosts = $derived(type === 'posts');
	let ready = $state(false);
	let query = $state('');
	let selectedTags = $state<string[]>([]);

	onMount(() => (ready = true));

	const allTags = $derived.by(() => {
		const tags = new SvelteSet<string>();
		items.forEach((i) => [...(i.tags || []), ...(i.tech || [])].forEach((t) => tags.add(t)));
		return Array.from(tags).sort();
	});

	const filtered = $derived.by(() => {
		let res = items;
		if (query) {
			const q = query.toLowerCase();
			res = res.filter(
				(i) =>
					i.title.toLowerCase().includes(q) ||
					i.description.toLowerCase().includes(q) ||
					[...(i.tags || []), ...(i.tech || [])].some((t) => t.toLowerCase().includes(q))
			);
		}
		if (selectedTags.length > 0)
			res = res.filter((i) =>
				selectedTags.every((t) => [...(i.tags || []), ...(i.tech || [])].includes(t))
			);
		return res;
	});

	const toggle = (t: string) =>
		(selectedTags = selectedTags.includes(t)
			? selectedTags.filter((s) => s !== t)
			: [...selectedTags, t]);

	import { getEnhancedImage } from '$lib/images';
</script>

<svelte:head><title>{isPosts ? 'Blog' : 'Projects'} | Oliver Walton</title></svelte:head>

<section class="relative min-h-[30vh] w-full overflow-hidden border-b border-surface-200-800/80">
	<InteractiveGrid />
	<div
		class="relative z-10 container mx-auto flex h-full min-h-[30vh] max-w-7xl flex-col justify-end px-6 pt-32 pb-12"
	>
		<div class="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
			<div>
				<h1
					class="font-heading text-6xl font-black tracking-tighter whitespace-pre-line text-surface-950-50 sm:text-7xl md:text-8xl"
				>
					{isPosts ? 'Blog.' : 'Projects.'}
				</h1>
			</div>
			<p
				class="hidden max-w-xs text-right font-mono text-sm tracking-wide text-surface-800-200 md:block"
			>
				{#if isPosts}
					Archive of thoughts, <br>deep-dives, and experiments.
				{:else}
					A collection of tools, <br>published work, and ad-hoc documentation.
				{/if}
			</p>
		</div>
	</div>
</section>

<section class="min-h-screen bg-surface-50-950 py-24">
	<div class="container mx-auto max-w-7xl px-6">
		<div class="mb-16 space-y-8">
			{#if ready}
				<div class="relative max-w-xl">
					<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
						<MagnifyingGlassIcon class="size-5 text-surface-400" />
					</div>
					<input
						type="text"
						bind:value={query}
						placeholder="Search {isPosts ? 'articles' : 'projects'}..."
						class="bg-surface-100-800 input w-full rounded-xl border-surface-200-800 py-3 pl-12 font-medium text-surface-950-50 placeholder:text-surface-800-200"
					/>
					{#if query}<button
							onclick={() => (query = '')}
							class="absolute inset-y-0 right-0 pr-4 text-surface-400 hover:text-surface-950-50"
							><XIcon class="size-4" /></button
						>{/if}
				</div>
			{/if}

			{#if ready}
				<div class="flex flex-wrap gap-2">
					{#each allTags as tag, i (tag)}
						<button
							use:reveal={{ delay: 50 + i * 20, y: 5 }}
							onclick={() => toggle(tag)}
							class="badge cursor-pointer px-3 py-1.5 font-mono text-xs font-bold uppercase transition-all {selectedTags.includes(
								tag
							)
								? 'variant-filled-primary'
								: 'variant-soft-surface'}"
						>
							<span class="flex items-center gap-2"
								>{#if selectedTags.includes(tag)}<XIcon
										weight="bold"
										class="size-3"
									/>{/if}{tag}</span
							>
						</button>
					{/each}
				</div>
			{/if}
		</div>

		{#if ready}
			<div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
				{#each filtered as i, idx (i.slug)}
					{@const tags = isPosts ? i.tags : i.tech}
					{@const img = getEnhancedImage(i.image)}

					<a
						href={resolve('/(public)/[collection=collection]/[slug]', {
							collection: isPosts ? 'blog' : 'projects',

							slug: i.slug
						})}
						use:reveal={{ delay: idx * 75 }}
						class="group bg-surface-100-800 hover:bg-surface-200-700 relative flex flex-col overflow-hidden rounded-3xl border border-surface-200-800 transition-all hover:-translate-y-1 hover:border-primary-500/80"
					>
						{#if img}
							<div class="h-48 w-full overflow-hidden">
								<enhanced:img
									src={img}
									alt={i.title}
									sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
									class="h-full w-full object-cover transition-transform group-hover:scale-105"
								/>

								<div
									class="from-surface-100-800 absolute inset-0 bg-linear-to-t to-transparent"
								></div>
							</div>
						{:else if i.image}
							<div class="h-48 w-full overflow-hidden">
								<img
									src={i.image}
									alt={i.title}
									class="h-full w-full object-cover transition-transform group-hover:scale-105"
								/>

								<div
									class="from-surface-100-800 absolute inset-0 bg-linear-to-t to-transparent"
								></div>
							</div>
						{:else}
							<div
								class="flex h-48 items-center justify-center bg-grid-paper opacity-30 transition-opacity group-hover:opacity-60"
								style="background-color: {getHSL(i.title)};"
							>
								<div class="from-surface-100-800 h-full w-full bg-linear-to-t to-transparent"></div>

								{#if !isPosts}<CodeIcon
										size={48}
										weight="thin"
										class="absolute text-surface-400"
									/>{/if}
							</div>
						{/if}

						<div class="flex grow flex-col p-8">
							<h2
								class="mb-3 font-heading text-2xl font-bold text-surface-950-50 transition-colors group-hover:text-primary-500"
							>
								{i.title}
							</h2>

							<p class="mb-4 line-clamp-3 grow text-base text-surface-800-200">
								{i.description}
							</p>

							<div class="mb-6 flex items-center gap-4">
								<time class="font-mono text-xs font-bold text-surface-600-400 uppercase"
									>{dateFormatter.format(new Date(i.date))}</time
								>
								{#if !isPosts && i.type}
									<span class="font-mono text-xs font-bold text-primary-500 uppercase"
										>{i.type}</span
									>
								{/if}
							</div>

							<div class="flex items-center justify-between border-t border-surface-200-800 pt-6">
								<div class="flex flex-wrap gap-2">
									{#if tags}{#each tags.slice(0, 2) as t (t)}<span
												class="text-xs font-bold text-surface-600-400 uppercase"
												>{isPosts ? '#' : ''}{t}</span
											>{/each}{#if tags.length > 2}<span
												class="text-xs font-bold text-surface-600-400">+ {tags.length - 2}</span
											>{/if}{/if}
								</div>

								<div
									class="flex items-center gap-2 font-bold text-surface-600-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary-500"
								>
									{#if !isPosts}<span class="text-xs">Explore</span>{/if}<ArrowRightIcon
										size={20}
									/>
								</div>
							</div>
						</div>
					</a>
				{:else}
					<div class="col-span-full py-32 text-center">
						<p class="font-heading text-3xl font-bold text-surface-400">Nothing found.</p>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</section>
