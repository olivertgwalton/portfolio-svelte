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

<BlogPreview posts={data.posts} />

<AboutSummary />
