<script lang="ts">
	import LandingHero from '$lib/components/LandingHero.svelte';
	import BlogPreview from '$lib/components/BlogPreview.svelte';
	import AboutSummary from '$lib/components/AboutSummary.svelte';
	import TechStack from '$lib/components/TechStack.svelte';

	export let data;
</script>

<svelte:head>
	<title>Oliver Walton | Software Engineer</title>
	<meta
		name="description"
		content="British software engineer specializing in Frontend Architecture, Linux Systems, and Embedded Development. Building precise digital experiences."
	/>

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://oliverwalton.dev/" />
	<meta property="og:title" content="Oliver Walton | Software Engineer" />
	<meta
		property="og:description"
		content="British software engineer specializing in Frontend Architecture, Linux Systems, and Embedded Development."
	/>

	<!-- Twitter -->
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:title" content="Oliver Walton | Software Engineer" />
	<meta
		property="twitter:description"
		content="British software engineer specializing in Frontend Architecture, Linux Systems, and Embedded Development."
	/>
</svelte:head>

<LandingHero />
<TechStack />

{#await data.posts}
	<div
		class="container mx-auto animate-pulse border-t border-stone-200 px-6 py-24 dark:border-stone-800"
	>
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
