<script lang="ts">
	import { resolve } from '$app/paths';
	import { reveal } from '$lib/actions';
	import type { ContentMetadata } from '$lib/content';
	import ContentCard from '$lib/components/ContentCard.svelte';
	import TabGroup from '$lib/components/TabGroup.svelte';

	let { projects = [], posts = [] } = $props<{
		projects: ContentMetadata[];
		posts: ContentMetadata[];
	}>();

	let activeTab = $state<'projects' | 'posts'>('projects');

	const items = $derived(activeTab === 'projects' ? projects : posts);
	const collection = $derived<'projects' | 'blog'>(activeTab === 'projects' ? 'projects' : 'blog');
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
				<TabGroup
					tabs={[
						{ id: 'projects', label: 'Projects' },
						{ id: 'posts', label: 'Writing' }
					]}
					bind:active={activeTab}
				/>

				<a
					href={resolve('/(public)/[collection=collection]', { collection })}
					class="shrink-0 text-[10px] font-black tracking-widest text-surface-600-400 uppercase transition-colors hover:text-primary-500"
				>
					View All {activeTab === 'projects' ? 'Projects' : 'Posts'}
				</a>
			</div>
		</div>

		<div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
			{#each items as item, i (item.slug)}
				<div class={i >= 3 ? 'hidden sm:block' : ''}>
					<ContentCard {item} {collection} index={i} />
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
