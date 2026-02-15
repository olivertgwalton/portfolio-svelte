<script lang="ts">
	import LandingHero from "$lib/components/LandingHero.svelte";
	import TechStack from "$lib/components/TechStack.svelte";

	const FeaturedWork = import("$lib/components/FeaturedWork.svelte")
		.then((m) => m.default)
		.catch(() => {
			return null;
		});
	const Experience = import("$lib/components/Experience.svelte")
		.then((m) => m.default)
		.catch(() => {
			return null;
		});
	const AboutSummary = import("$lib/components/AboutSummary.svelte")
		.then((m) => m.default)
		.catch(() => {
			return null;
		});

	let { data } = $props();
</script>

<LandingHero />
<TechStack />
{#await FeaturedWork then FeaturedWork}
	{#if FeaturedWork}
		<FeaturedWork projects={data.projects} posts={data.posts} />
	{/if}
{/await}
{#await Experience then Experience}
	{#if Experience}
		<Experience
			experience={data.experience}
			education={data.education}
			certifications={data.certifications}
		/>
	{/if}
{/await}
{#await AboutSummary then AboutSummary}
	{#if AboutSummary}
		<AboutSummary />
	{/if}
{/await}
