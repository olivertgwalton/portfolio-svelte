<script lang="ts">
	import { resolve } from '$app/paths';
	import ArrowRightIcon from 'phosphor-svelte/lib/ArrowRightIcon';
	import { reveal } from '$lib/actions';

	interface Post {
		slug: string;
		title: string;
		description: string;
		date: string;
		tags?: string[];
		image?: string;
	}

	let { posts = [] }: { posts: Post[] } = $props();

	function formatDate(dateStr: string) {
		if (!dateStr) return '';
		return new Intl.DateTimeFormat('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		}).format(new Date(dateStr));
	}

	// Generate color from string for fallback pattern
	function stringToColor(str: string) {
		let hash = 0;
		for (let i = 0; i < str.length; i++) {
			hash = str.charCodeAt(i) + ((hash << 5) - hash);
		}
		const c = (hash & 0x00ffffff).toString(16).toUpperCase();
		return '#' + '00000'.substring(0, 6 - c.length) + c;
	}
</script>

<section class="border-t border-surface-200-800 bg-surface-50-950 px-6 py-32">
	<div class="container mx-auto max-w-7xl">
		<!-- Header -->
		<div class="mb-16 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
			<div>
				<h2
					use:reveal={{ delay: 0 }}
					class="font-heading text-5xl font-black tracking-tighter text-surface-950-50 md:text-6xl"
				>
					Writing.
				</h2>
			</div>
			<div class="hidden md:block">
				<div use:reveal={{ delay: 100 }}>
					<a href={resolve('/blog')} class="variant-soft-surface btn font-bold">View Archive</a>
				</div>
			</div>
		</div>

		<!-- Posts Grid -->
		<div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
			{#each posts as post, i (post.slug)}
				<a
					href={resolve(`/blog/${post.slug}`)}
					use:reveal={{ delay: 150 + i * 75 }}
					class="group bg-surface-100-800 hover:bg-surface-200-700 relative flex flex-col overflow-hidden rounded-3xl border border-surface-200-800 transition-all hover:-translate-y-1 hover:border-primary-500/50"
				>
					<!-- Visual Header -->
					{#if post.image}
						<div class="h-48 w-full overflow-hidden">
							<img
								src={post.image}
								alt={post.title}
								class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
							/>
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
				<div class="col-span-full py-16 text-center">
					<p class="font-heading text-2xl font-bold text-surface-600-400">Coming soon.</p>
				</div>
			{/each}
		</div>

		<!-- Mobile CTA -->
		<div class="mt-10 block md:hidden">
			<div use:reveal={{ delay: 300 }}>
				<a href={resolve('/blog')} class="variant-soft-surface btn w-full font-bold">
					View Archive
				</a>
			</div>
		</div>
	</div>
</section>
