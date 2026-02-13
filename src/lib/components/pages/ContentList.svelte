<script lang="ts">
	import { reveal } from '$lib/actions';
	import MagnifyingGlassIcon from 'phosphor-svelte/lib/MagnifyingGlassIcon';
	import XIcon from 'phosphor-svelte/lib/XIcon';
	import PageHero from '$lib/components/PageHero.svelte';
	import ContentCard from '$lib/components/ContentCard.svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import { getItemTags, type ContentMetadata, type ContentType } from '$lib/content';

	let { items, type }: { items: ContentMetadata[]; type: ContentType } = $props();

	const isPosts = $derived(type === 'posts');
	const collection = $derived<'projects' | 'blog'>(isPosts ? 'blog' : 'projects');
	let query = $state('');
	let selectedTags = $state<string[]>([]);

	const allTags = $derived.by(() => {
		const tags = new SvelteSet<string>();
		items.forEach((i) => getItemTags(i).forEach((t) => tags.add(t)));
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
					getItemTags(i).some((t) => t.toLowerCase().includes(q))
			);
		}
		if (selectedTags.length > 0)
			res = res.filter((i) => selectedTags.every((t) => getItemTags(i).includes(t)));
		return res;
	});

	const toggle = (t: string) =>
		(selectedTags = selectedTags.includes(t)
			? selectedTags.filter((s) => s !== t)
			: [...selectedTags, t]);
</script>

<svelte:head><title>{isPosts ? 'Blog' : 'Projects'} | Oliver Walton</title></svelte:head>

<PageHero title={isPosts ? 'Blog.' : 'Projects.'} large>
	{#snippet subtitle()}
		{#if isPosts}
			Archive of thoughts, <br>deep-dives, and experiments.
		{:else}
			A collection of tools, <br>published work, and ad-hoc documentation.
		{/if}
	{/snippet}
</PageHero>

<section class="min-h-screen bg-surface-50-950 py-24">
	<div class="container mx-auto max-w-7xl px-6">
		<div class="mb-16 space-y-8">
			<div class="relative max-w-xl">
				<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
					<span aria-hidden="true"><MagnifyingGlassIcon class="size-5 text-surface-400" /></span>
				</div>
				<input
					type="text"
					bind:value={query}
					placeholder="Search {isPosts ? 'articles' : 'projects'}..."
					class="bg-surface-100-800 input w-full rounded-xl border-surface-200-800 py-3 pl-12 font-medium text-surface-950-50 placeholder:text-surface-800-200"
				/>
				{#if query}<button
						onclick={() => (query = '')}
						aria-label="Clear search"
						class="absolute inset-y-0 right-0 pr-4 text-surface-400 hover:text-surface-950-50"
					><span aria-hidden="true"><XIcon class="size-4" /></span></button
					>{/if}
			</div>

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
							>{#if selectedTags.includes(tag)}<span aria-hidden="true"><XIcon
										weight="bold"
										class="size-3"
									/></span>{/if}{tag}</span
						>
					</button>
				{/each}
			</div>
		</div>

		<div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
			{#each filtered as item, idx (item.slug)}
				<ContentCard {item} {collection} index={idx} />
			{:else}
				<div class="col-span-full py-32 text-center">
					<p class="font-heading text-3xl font-bold text-surface-400">Nothing found.</p>
				</div>
			{/each}
		</div>
	</div>
</section>
