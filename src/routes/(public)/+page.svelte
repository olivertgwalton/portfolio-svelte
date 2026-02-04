<script lang="ts">
	import LandingHero from '$lib/components/LandingHero.svelte';
	import BlogPreview from '$lib/components/BlogPreview.svelte';
	import AboutSummary from '$lib/components/AboutSummary.svelte';
	import TechStack from '$lib/components/TechStack.svelte';
	import MetaTags from '$lib/components/MetaTags.svelte';

	let { data } = $props();
</script>

<MetaTags />

<LandingHero />
<TechStack />

{#await data.posts}
	<div class="border-border container mx-auto animate-pulse border-t px-6 py-24">
		<div class="mb-16 h-12 w-48 rounded bg-stone-200 dark:bg-stone-800"></div>
		<div class="space-y-8">
			<div class="h-32 w-full rounded bg-stone-100 dark:bg-stone-800"></div>
			<div class="h-32 w-full rounded bg-stone-100 dark:bg-stone-800"></div>
		</div>
	</div>
{:then posts}
	<BlogPreview {posts} />
{/await}

<AboutSummary />
