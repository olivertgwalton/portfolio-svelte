<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { reveal } from '$lib/actions';
	import { untrack } from 'svelte';
	import ArrowRight from 'phosphor-svelte/lib/ArrowRight';
	import MagnifyingGlass from 'phosphor-svelte/lib/MagnifyingGlass';

	let { data } = $props();
	let searchQuery = $state(untrack(() => data.search)); // eslint-disable-line svelte/prefer-writable-derived
	let timer: NodeJS.Timeout;

	$effect(() => {
		searchQuery = data.search;
	});

	function handleSearch(e: Event) {
		const value = (e.target as HTMLInputElement).value;
		searchQuery = value;

		clearTimeout(timer);
		timer = setTimeout(() => {
			const url = new URL(page.url);
			if (value) {
				url.searchParams.set('q', value);
			} else {
				url.searchParams.delete('q');
			}
			// eslint-disable-next-line svelte/no-navigation-without-resolve
			goto(url, { keepFocus: true, noScroll: true });
		}, 300);
	}

	function handleTagClick(tag: string) {
		const url = new URL(page.url);
		if (data.currentTag === tag) {
			url.searchParams.delete('tag');
		} else {
			url.searchParams.set('tag', tag);
		}
		goto(url, { keepFocus: true, noScroll: true });
	}

	function formatDate(date: Date | null) {
		if (!date) return '';
		return new Intl.DateTimeFormat('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		}).format(date);
	}
</script>

<svelte:head>
	<title>Writing | Oliver Walton</title>
	<meta name="description" content="Thoughts on software engineering, design, and systems." />
</svelte:head>

<section class="min-h-screen border-b border-stone-200 bg-(--color-base) dark:border-stone-800">
	<div class="container mx-auto max-w-5xl px-6 py-32">
		<!-- Header -->
		<div class="mb-20 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
			<div>
				<h1
					class="font-serif text-6xl font-black tracking-tighter text-stone-900 md:text-8xl dark:text-stone-100"
				>
					Writing.
				</h1>
			</div>
			<p
				class="hidden max-w-xs text-right text-sm font-bold tracking-wide text-stone-500 md:block dark:text-stone-400"
			>
				Archive of thoughts <br />and technical notes.
			</p>
		</div>

		<!-- Search & Filter Bar -->
		<div class="mb-8">
			<div class="relative max-w-md">
				<div class="absolute top-1/2 left-4 -translate-y-1/2 text-stone-400">
					<MagnifyingGlass size={20} weight="bold" />
				</div>
				<input
					type="text"
					placeholder="Search articles..."
					value={searchQuery}
					oninput={handleSearch}
					class="w-full rounded-full border-2 border-stone-200 bg-transparent py-4 pr-6 pl-12 text-sm font-bold text-stone-900 placeholder-stone-400 transition-colors outline-none focus:border-stone-900 dark:border-stone-800 dark:text-stone-100 dark:focus:border-stone-100"
				/>
			</div>
		</div>

		<!-- Tag Filters -->
		{#if data.tags.length > 0}
			<div class="mb-20 flex flex-wrap gap-2">
				{#each data.tags as tag (tag)}
					<button
						onclick={() => handleTagClick(tag)}
						class="rounded-full border px-3 py-1 text-xs font-bold tracking-wide uppercase transition-colors
						{data.currentTag === tag
							? 'border-stone-900 bg-stone-900 text-white dark:border-stone-100 dark:bg-stone-100 dark:text-stone-900'
							: 'border-stone-200 bg-transparent text-stone-500 hover:border-stone-400 hover:text-stone-900 dark:border-stone-800 dark:text-stone-400 dark:hover:border-stone-600 dark:hover:text-stone-100'}"
					>
						{tag}
					</button>
				{/each}
			</div>
		{/if}

		<!-- Posts Grid -->
		<ul class="grid gap-0 border-t-2 border-stone-900 dark:border-stone-100">
			{#each data.posts as post, i (post.id)}
				<li>
					<a
						href={resolve(`/blog/${post.slug}`)}
						class="group block border-b-2 border-stone-900 transition-colors hover:bg-stone-50 dark:border-stone-100 dark:hover:bg-stone-900"
					>
						<article
							use:reveal={{ delay: i * 50 }}
							class="grid gap-8 py-12 md:grid-cols-[200px_1fr_auto] md:items-baseline md:px-6"
						>
							<!-- Date -->
							<time
								datetime={post.publishedAt ? new Date(post.publishedAt).toISOString() : ''}
								class="font-mono text-sm font-bold tracking-wider text-stone-500 uppercase dark:text-stone-400"
							>
								{formatDate(post.publishedAt ? new Date(post.publishedAt) : null)}
							</time>

							<!-- Content -->
							<div class="space-y-6">
								<h3
									class="font-serif text-3xl leading-tight font-bold tracking-tight text-stone-900 transition-colors group-hover:text-stone-600 md:text-3xl dark:text-stone-100 dark:group-hover:text-stone-300"
								>
									{post.title}
								</h3>
								<p
									class="line-clamp-2 max-w-2xl text-base leading-relaxed font-medium text-stone-600 dark:text-stone-400"
								>
									{post.excerpt}
								</p>
								{#if post.tags}
									<div class="flex flex-wrap gap-2">
										{#each post.tags.split(',') as tag (tag)}
											<span class="font-mono text-xs font-bold text-stone-400 dark:text-stone-500"
												>#{tag.trim()}</span
											>
										{/each}
									</div>
								{/if}
							</div>

							<!-- Arrow -->
							<div class="hidden md:block">
								<span
									class="text-stone-900 transition-transform duration-300 group-hover:translate-x-4 dark:text-stone-100"
								>
									<ArrowRight size={32} weight="light" />
								</span>
							</div>
						</article>
					</a>
				</li>
			{:else}
				<li class="py-32 text-center">
					<p class="font-serif text-3xl font-bold text-stone-400">No articles found.</p>
				</li>
			{/each}
		</ul>
	</div>
</section>
