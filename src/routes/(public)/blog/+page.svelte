<script lang="ts">
	import { resolve } from '$app/paths';
	import { fly } from 'svelte/transition';
	import { onMount } from 'svelte';
	import ArrowRightIcon from 'phosphor-svelte/lib/ArrowRightIcon';
	import MagnifyingGlassIcon from 'phosphor-svelte/lib/MagnifyingGlassIcon';
	import XIcon from 'phosphor-svelte/lib/XIcon';
	import InteractiveGrid from '$lib/components/visuals/InteractiveGrid.svelte';
	import { SvelteSet } from 'svelte/reactivity';

	let { data } = $props();

	// State
	let searchQuery = $state('');
	let selectedTags = $state<string[]>([]);
	let ready = $state(false);

	onMount(() => {
		ready = true;
	});

	// Derived
	const allTags = $derived.by(() => {
		const tags = new SvelteSet<string>();
		data.posts.forEach((post) => post.tags?.forEach((tag) => tags.add(tag)));
		return Array.from(tags).sort();
	});

	const filteredPosts = $derived.by(() => {
		let posts = data.posts;

		// Filter by search query
		if (searchQuery) {
			const q = searchQuery.toLowerCase();
			posts = posts.filter(
				(post) =>
					post.title.toLowerCase().includes(q) ||
					post.description.toLowerCase().includes(q) ||
					post.tags?.some((tag) => tag.toLowerCase().includes(q))
			);
		}

		// Filter by selected tags
		if (selectedTags.length > 0) {
			posts = posts.filter((post) => selectedTags.every((tag) => post.tags?.includes(tag)));
		}

		return posts;
	});

	function toggleTag(tag: string) {
		if (selectedTags.includes(tag)) {
			selectedTags = selectedTags.filter((t) => t !== tag);
		} else {
			selectedTags = [...selectedTags, tag];
		}
	}

	// Add helper for generating colors
	function stringToColor(str: string) {
		let hash = 0;
		for (let i = 0; i < str.length; i++) {
			hash = str.charCodeAt(i) + ((hash << 5) - hash);
		}
		const c = (hash & 0x00ffffff).toString(16).toUpperCase();
		return '#' + '00000'.substring(0, 6 - c.length) + c;
	}

	function formatDate(dateStr: string) {
		if (!dateStr) return '';
		return new Intl.DateTimeFormat('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		}).format(new Date(dateStr));
	}
</script>

<svelte:head>
	<title>Writing | Oliver Walton</title>
	<meta name="description" content="Thoughts on software engineering, design, and systems." />
</svelte:head>

<section class="relative min-h-[30vh] w-full overflow-hidden border-b border-surface-200-800">
	<InteractiveGrid />
	<div
		class="relative z-10 container mx-auto flex h-full min-h-[30vh] flex-col justify-end px-6 pt-32 pb-12"
	>
		<div class="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
			<div>
				{#if ready}
					<h1
						in:fly={{ y: 20, duration: 600, delay: 0 }}
						class="font-heading text-6xl font-black tracking-tighter text-surface-950-50 sm:text-7xl md:text-8xl"
					>
						Writing.
					</h1>
				{/if}
			</div>
			{#if ready}
				<p
					in:fly={{ y: 20, duration: 600, delay: 100 }}
					class="hidden max-w-xs text-right font-mono text-sm tracking-wide text-surface-600-400 md:block"
				>
					Archive of thoughts, <br />notes, and experiments.
				</p>
			{/if}
		</div>
	</div>
</section>

<section class="min-h-screen bg-surface-50-950 px-6 py-24">
	<div class="container mx-auto max-w-7xl">
		<!-- Search & Filter Controls -->
		<div class="mb-16 space-y-8">
			{#if ready}
				<!-- Search Bar -->
				<div class="relative max-w-xl" in:fly={{ y: 20, duration: 600, delay: 200 }}>
					<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
						<MagnifyingGlassIcon class="size-5 text-surface-400" />
					</div>
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Search articles..."
					class="bg-surface-100-800 input w-full rounded-xl border-surface-200-800 py-3 pl-12 font-medium placeholder:text-surface-400 focus:border-primary-500 focus:ring-primary-500"
				/>
				{#if searchQuery}
					<button
						onclick={() => (searchQuery = '')}
						class="absolute inset-y-0 right-0 flex items-center pr-4 text-surface-400 hover:text-surface-950-50"
					>
						<XIcon class="size-4" />
					</button>
				{/if}
			</div>

			<!-- Tags -->
						{#if allTags.length > 0}
							<div class="flex flex-wrap items-center gap-2" in:fly={{ y: 20, duration: 600, delay: 300 }}>
								{#each allTags as tag (tag)}
									{@const isActive = selectedTags.includes(tag)}
									<button
										onclick={() => toggleTag(tag)}
										class="badge cursor-pointer px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200
								                            {isActive
												? 'variant-filled-primary ring-1 ring-primary-500'
												: 'variant-soft-surface hover:bg-surface-200 dark:hover:bg-surface-700'}"
									>
										<span class="flex items-center gap-2">
											{#if isActive}
												<XIcon weight="bold" class="size-3" />
											{/if}
											{tag}
										</span>
									</button>
								{/each}
							</div>
						{/if}
						{/if}
					</div>
		<!-- Posts Grid -->
		<div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
			{#if ready}
				{#each filteredPosts as post, i (post.slug)}
					<a
						href={resolve(`/blog/${post.slug}`)}
						class="group bg-surface-100-800 hover:bg-surface-200-700 relative flex flex-col overflow-hidden rounded-3xl border border-surface-200-800 transition-all hover:-translate-y-1 hover:border-primary-500/50"
						in:fly={{ y: 20, duration: 600, delay: 400 + i * 100 }}
					>
						<!-- Visual Header -->
					{#if post.image}
						<div class="h-48 w-full overflow-hidden">
							<!-- Note: In a real app, use enhanced:img for optimized loading.
                                 Here we use a standard img tag for simplicity with dynamic paths,
                                 or you'd need to import them all via Vite's glob import.
                                 For now, we assume standard static assets or external URLs.
                                 Since the path is /src/..., we might need to adjust for dev vs prod
                                 or rely on Vite's asset handling.
                                 For this demo, let's assume it's handled or use the generative fallback
                                 if it breaks. -->
							<!-- Actually, let's just use the generative pattern for consistency
                                  UNLESS we strictly want the image. The user asked for an example image.
                                  Let's try to load it. -->
							<img
								src={post.image.replace('/src/lib', '/src/lib')}
								alt={post.title}
								class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
							/>
							<div
								class="from-surface-100-800/80 absolute inset-0 bg-linear-to-t to-transparent"
							></div>
						</div>
					{:else}
						<div
							class="bg-grid-paper h-48 w-full opacity-30 transition-opacity group-hover:opacity-60"
							style="background-color: {stringToColor(post.title)}20;"
						>
							<div class="from-surface-100-800 h-full w-full bg-linear-to-t to-transparent"></div>
						</div>
					{/if}

					<div class="flex grow flex-col p-8">
						<!-- Date -->
						<time
							datetime={post.date}
							class="mb-4 block font-mono text-xs font-bold tracking-wider text-surface-500 uppercase"
						>
							{formatDate(post.date)}
						</time>

						<!-- Title -->
						<h3
							class="mb-4 font-heading text-2xl leading-tight font-bold tracking-tight text-surface-950-50 transition-colors group-hover:text-primary-500"
						>
							{post.title}
						</h3>

						<!-- Description -->
						<p class="mb-6 line-clamp-3 grow text-base leading-relaxed text-surface-600-400">
							{post.description}
						</p>

						<!-- Footer -->
						<div class="flex items-center justify-between border-t border-surface-200-800 pt-6">
							{#if post.tags}
								<div class="flex flex-wrap gap-2">
									{#each post.tags.slice(0, 2) as tag (tag)}
										<span class="text-xs font-bold tracking-wide text-surface-500 uppercase"
											>#{tag}</span
										>
									{/each}
									{#if post.tags.length > 2}
										<span class="text-xs font-bold text-surface-500">+ {post.tags.length - 2}</span>
									{/if}
								</div>
							{/if}

							<div
								class="text-surface-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary-500"
							>
								<ArrowRightIcon size={20} />
							</div>
						</div>
					</div>
				</a>
			{:else}
				<div class="col-span-full py-32 text-center">
					<p class="font-heading text-3xl font-bold text-surface-400">No articles found.</p>
					{#if searchQuery || selectedTags.length > 0}
						<button
							onclick={() => {
								searchQuery = '';
								selectedTags = [];
							}}
							class="btn variant-soft-primary mt-6"
						>
							Clear filters
						</button>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</section>
