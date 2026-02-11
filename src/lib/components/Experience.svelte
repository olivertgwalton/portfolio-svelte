<script lang="ts">
	import { reveal } from '$lib/actions';
	import BriefcaseIcon from 'phosphor-svelte/lib/BriefcaseIcon';
	import GraduationCapIcon from 'phosphor-svelte/lib/GraduationCapIcon';
	import ArrowSquareOutIcon from 'phosphor-svelte/lib/ArrowSquareOutIcon';
	import type { Component } from 'svelte';
	import type { IconWeight } from 'phosphor-svelte';
	import { resolve } from '$app/paths';
	import type { ContentMetadata } from '$lib/content';

	type RoutePath = Parameters<typeof resolve>[0];
	type Category = 'experience' | 'education';

	interface Props {
		experience?: ContentMetadata[];
		education?: ContentMetadata[];
	}

	let { experience = [], education = [] }: Props = $props();

	let activeTab = $state<Category>('experience');

	interface TimelineItem {
		title: string;
		organization: string;
		period: string;
		current?: boolean;
		bullets: string[];
		skills: string[];
		link?: RoutePath | string | { collection: string; slug: string };
	}

	interface CategoryConfig {
		label: string;
		icon: Component<{ size?: number; weight?: IconWeight }>;
	}

	const categories: Record<Category, CategoryConfig> = {
		experience: { label: 'Experience', icon: BriefcaseIcon },
		education: { label: 'Education', icon: GraduationCapIcon }
	};

	function mapContentToTimeline(items: ContentMetadata[]): TimelineItem[] {
		return items.map((item) => {
			let link: TimelineItem['link'] = undefined;

			// Handle links based on type
			if (item.github) {
				link = item.github;
			} else if (item.demo) {
				link = item.demo;
			}

			// Format period from date if not explicitly provided
			let period = item.period;
			if (!period && item.date) {
				const year = new Date(item.date).getFullYear();
				period = item.current ? `${year} - Present` : `${year}`;
			}

			return {
				title: item.title,
				organization: item.organization || item.type || '',
				period: period || '',
				current: item.current,
				bullets: item.highlights || (item.description ? [item.description] : []),
				skills: item.skills || item.tech || [],
				link
			};
		});
	}

	const data = $derived<Record<Category, TimelineItem[]>>({
		experience: mapContentToTimeline(experience),
		education: mapContentToTimeline(education)
	});

	const activeItems = $derived(data[activeTab]);
	const ActiveIcon = $derived(categories[activeTab].icon);
</script>

<section class="border-t border-surface-200-800/80 bg-surface-50-950 py-32">
	<div class="container mx-auto max-w-7xl px-6">
		<!-- Header -->
		<div class="mb-12 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
			<div>
				<h2
					use:reveal={{ delay: 0 }}
					class="font-heading text-5xl font-black tracking-tighter text-surface-950-50 md:text-6xl"
				>
					Background.
				</h2>
			</div>
			<div class="hidden md:block">
				<p
					use:reveal={{ delay: 100 }}
					class="hidden max-w-xs text-right text-sm font-bold tracking-wide text-surface-600-400 md:block"
				>
					Professional journey, <br />education, and projects.
				</p>
			</div>
		</div>

		<!-- Tabs -->
		<div use:reveal={{ delay: 150 }} class="mb-16 flex flex-wrap gap-2">
			{#each Object.entries(categories) as [id, config] (id)}
				<button
					onclick={() => (activeTab = id as Category)}
					class="rounded-full px-5 py-2.5 font-mono text-xs font-bold tracking-wider uppercase transition-all
						{activeTab === id
						? 'bg-primary-500 text-white'
						: 'bg-surface-200-700 hover:bg-surface-300-600 text-surface-600-400 hover:text-surface-950-50'}"
				>
					{config.label}
				</button>
			{/each}
		</div>

		<!-- Timeline -->
		<div class="relative">
			<div class="absolute top-0 left-4 h-full w-px bg-surface-200-800 md:left-8"></div>

			<div class="space-y-8">
				{#each activeItems as item, i (item.title + item.organization)}
					<div use:reveal={{ delay: 200 + i * 75 }} class="relative pl-16 md:pl-20">
						<!-- Timeline Node -->
						<div
							class="absolute top-0 left-4 z-10 flex size-8 -translate-x-1/2 items-center justify-center rounded-full border-2 md:left-8
								{item.current
								? 'border-primary-500 bg-primary-500 text-white'
								: 'border-surface-300-700 bg-surface-50-950 text-surface-500'}"
						>
							<ActiveIcon size={14} weight="bold" />
						</div>

						<!-- Content Card -->
						<div
							class="bg-surface-100-800 rounded-2xl border border-surface-200-800 p-6 transition-all hover:border-primary-500/80"
						>
							<div
								class="mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 font-mono text-xs font-bold tracking-wider uppercase
									{item.current ? 'bg-primary-500/10 text-primary-500' : 'bg-surface-200-700 text-surface-500'}"
							>
								{#if item.current}
									<span class="size-1.5 animate-pulse rounded-full bg-primary-500"></span>
								{/if}
								{item.period}
							</div>

							<h3 class="mb-1 font-heading text-xl font-bold text-surface-950-50">{item.title}</h3>
							<p class="mb-4 text-sm font-semibold text-surface-500">{item.organization}</p>

							<ul class="mb-4 space-y-2 text-sm leading-relaxed text-surface-600-400">
								{#each item.bullets as bullet (bullet)}
									<li class="flex items-start gap-2">
										<span class="mt-2.5 size-1 shrink-0 rounded-full bg-surface-400"></span>
										<span>{bullet}</span>
									</li>
								{/each}
							</ul>

							<div class="flex flex-wrap gap-2">
								{#each item.skills as skill (skill)}
									<span
										class="rounded-full border border-surface-200-800 px-2.5 py-1 text-[10px] font-bold tracking-wide text-surface-500 uppercase"
									>
										{skill}
									</span>
								{/each}
							</div>

							{#if item.link}
								<div class="mt-6">
									{#if typeof item.link === 'string'}
										<a
											href={item.link}
											target="_blank"
											rel="external noopener noreferrer"
											class="inline-flex items-center gap-2 text-sm font-bold text-primary-500 transition-colors hover:text-primary-600"
										>
											<span>View Project</span>
											<ArrowSquareOutIcon size={16} weight="bold" />
										</a>
									{:else}
										<a
											href={resolve('/(public)/[collection=collection]/[slug]', item.link)}
											class="inline-flex items-center gap-2 text-sm font-bold text-primary-500 transition-colors hover:text-primary-600"
										>
											<span>View Project</span>
											<ArrowSquareOutIcon size={16} weight="bold" />
										</a>
									{/if}
								</div>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>
