<script lang="ts">
	import { resolve } from '$app/paths';
	import { formatDate } from '$lib/utils';
	import { reveal } from '$lib/actions';
	import { getItemTags, type ContentMetadata } from '$lib/content';
	import ContentImage from '$lib/components/ContentImage.svelte';
	import ArrowRightIcon from 'phosphor-svelte/lib/ArrowRightIcon';

	let {
		item,
		collection,
		index = 0,
		variant = 'full'
	}: {
		item: ContentMetadata;
		collection: 'projects' | 'blog';
		index?: number;
		variant?: 'full' | 'compact';
	} = $props();

	const isProject = $derived(collection === 'projects');
	const tags = $derived(getItemTags(item));
</script>

{#if variant === 'compact'}
	<a
		href={resolve('/(public)/[collection=collection]/[slug]', { collection, slug: item.slug })}
		class="group rounded-xl border border-surface-200-800 p-5 transition-colors hover:border-primary-500/50 hover:bg-surface-100-900"
	>
		<h3 class="font-heading text-lg font-bold text-surface-950-50 group-hover:text-primary-500">
			{item.title}
		</h3>
		<p class="mt-2 line-clamp-2 text-sm text-surface-600-400">{item.description}</p>
		<div class="mt-3 flex items-center gap-3 text-xs text-surface-500">
			<span>{formatDate(item.date)}</span>
			{#if tags.length}
				<span class="text-surface-300-700">&middot;</span>
				<div class="flex flex-wrap gap-1">
					{#each tags.slice(0, 3) as tag (tag)}
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
{:else}
	<a
		href={resolve('/(public)/[collection=collection]/[slug]', { collection, slug: item.slug })}
		use:reveal={{ delay: index * 75 }}
		class="group bg-surface-100-800 hover:bg-surface-200-700 relative flex flex-col overflow-hidden rounded-3xl border border-surface-200-800 transition-all hover:-translate-y-1 hover:border-primary-500/80"
	>
		<ContentImage image={item.image} title={item.title} showIcon={isProject} />

		<div class="flex grow flex-col p-8">
			<h2
				class="mb-3 font-heading text-2xl font-bold text-surface-950-50 transition-colors group-hover:text-primary-500"
			>
				{item.title}
			</h2>

			<p class="mb-4 line-clamp-3 grow text-base text-surface-800-200">
				{item.description}
			</p>

			<div class="mb-6 flex items-center gap-4">
				<time class="font-mono text-xs font-bold text-surface-600-400 uppercase"
					>{formatDate(item.date)}</time
				>
				{#if isProject && item.type}
					<span class="font-mono text-xs font-bold text-primary-500 uppercase">{item.type}</span>
				{/if}
			</div>

			<div class="flex items-center justify-between border-t border-surface-200-800 pt-6">
				<div class="flex flex-wrap gap-2">
					{#each tags.slice(0, 3) as t (t)}
						<span class="text-xs font-bold tracking-wide text-surface-500 uppercase"
							>{isProject ? '' : '#'}{t}</span
						>
					{/each}
					{#if tags.length > 3}
						<span class="text-xs font-bold text-surface-500">+ {tags.length - 3}</span>
					{/if}
				</div>

				<div
					class="text-surface-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary-500"
					aria-label="View {isProject ? 'project' : 'post'}: {item.title}"
				>
					<span aria-hidden="true"><ArrowRightIcon size={20} /></span>
				</div>
			</div>
		</div>
	</a>
{/if}
