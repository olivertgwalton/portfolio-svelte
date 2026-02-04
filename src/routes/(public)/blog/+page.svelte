<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { reveal } from '$lib/actions';
	import { untrack } from 'svelte';
	import { SvelteURLSearchParams } from 'svelte/reactivity';
	import ArrowRight from 'phosphor-svelte/lib/ArrowRight';
	import MagnifyingGlass from 'phosphor-svelte/lib/MagnifyingGlass';
	import InteractiveGrid from '$lib/components/visuals/InteractiveGrid.svelte';

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
			const currentParams = new SvelteURLSearchParams(page.url.searchParams);
			if (value) {
				currentParams.set('q', value);
			} else {
				currentParams.delete('q');
			}
			// eslint-disable-next-line svelte/no-navigation-without-resolve
			goto(resolve('/blog') + `?${currentParams.toString()}`, { keepFocus: true, noScroll: true });
		}, 300);
	}

	function handleTagClick(tag: string) {
		const currentParams = new SvelteURLSearchParams(page.url.searchParams);
		if (data.currentTag === tag) {
			currentParams.delete('tag');
		} else {
			currentParams.set('tag', tag);
		}
		// eslint-disable-next-line svelte/no-navigation-without-resolve
		goto(resolve('/blog') + `?${currentParams.toString()}`, { keepFocus: true, noScroll: true });
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

<section class="relative min-h-[30vh] w-full overflow-hidden border-b border-border">
	<InteractiveGrid />
	<div
		class="relative z-10 container mx-auto flex h-full min-h-[30vh] flex-col justify-end px-6 pt-32 pb-12"
	>
		<div class="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
			<div>
				<h1
					use:reveal={{ delay: 0, y: 20 }}
					class="font-heading text-6xl font-black tracking-tighter text-primary"
				>
					Writing.
				</h1>
			</div>
			<p
				use:reveal={{ delay: 100, y: 20 }}
				class="hidden max-w-xs text-right text-sm font-bold tracking-wide text-muted md:block dark:text-muted"
			>
				Archive of thoughts <br />and technical notes.
			</p>
		</div>
	</div>
</section>

<section class="min-h-screen bg-base">
	<div class="container mx-auto max-w-5xl px-6 py-20">
		<!-- Search & Filter Bar -->
		<div class="mb-8" use:reveal={{ delay: 200, y: 20 }}>
			<div class="relative max-w-md">
				<div class="absolute top-1/2 left-4 -translate-y-1/2 text-muted">
					<MagnifyingGlass size={20} weight="bold" />
				</div>
				<input
					type="text"
					placeholder="Search articles..."
					value={searchQuery}
					oninput={handleSearch}
					class="w-full rounded-full border-2 border-border bg-transparent py-4 pr-6 pl-12 text-sm font-bold text-primary dark:focus:border-stone-100"
				/>
			</div>
		</div>

		<!-- Tag Filters -->
		{#if data.tags.length > 0}
			<div class="mb-20 flex flex-wrap gap-2" use:reveal={{ delay: 300, y: 20 }}>
				{#each data.tags as tag (tag)}
					<button
						onclick={() => handleTagClick(tag)}
						class="rounded-full border px-3 py-1 text-xs font-bold tracking-wide uppercase transition-colors
											{data.currentTag === tag
							? 'border-primary bg-primary text-base'
							: 'border-border bg-transparent text-muted hover:border-muted hover:text-primary'}"
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
						class="group block border-b-2 border-stone-900 transition-colors hover:bg-stone-50 dark:border-stone-100 dark:hover:bg-surface"
					>
						<article
							use:reveal={{ delay: i * 50 }}
							class="grid gap-8 py-12 md:grid-cols-[200px_1fr_auto] md:items-baseline md:px-6"
						>
							<!-- Date -->
							<time
								datetime={post.publishedAt ? new Date(post.publishedAt).toISOString() : ''}
								class="font-mono text-sm font-bold tracking-wider text-muted uppercase dark:text-muted"
							>
								{formatDate(post.publishedAt ? new Date(post.publishedAt) : null)}
							</time>

							<!-- Content -->
							<div class="space-y-6">
								<h3
									class="font-heading text-3xl leading-tight font-bold tracking-tight text-primary transition-colors group-hover:text-secondary"
								>
									{post.title}
								</h3>
								<p class="line-clamp-2 max-w-2xl leading-relaxed font-medium text-base">
									{post.excerpt}
								</p>
								{#if post.tags}
									<div class="flex flex-wrap gap-2">
										{#each post.tags.split(',') as tag (tag)}
											<span class="font-mono text-xs font-bold text-muted dark:text-muted"
												>#{tag.trim()}</span
											>
										{/each}
									</div>
								{/if}
							</div>

							<!-- Arrow -->
							<div class="hidden md:block">
								<span class="text-primary">
									<ArrowRight size={32} weight="light" />
								</span>
							</div>
						</article>
					</a>
				</li>
			{:else}
				<li class="py-32 text-center">
					<p class="font-heading text-3xl font-bold text-muted">No articles found.</p>
				</li>
			{/each}
		</ul>
	</div>
</section>
