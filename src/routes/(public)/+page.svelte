<script lang="ts">
import LandingHero from "#lib/components/LandingHero.svelte";
import TechStack from "#lib/components/TechStack.svelte";
import type { PageProps } from "./$types";

const lazy = <T>(module: Promise<{ default: T }>) =>
	module.then((m) => m.default).catch(() => null);

const FeaturedWork = lazy(import("#lib/components/FeaturedWork.svelte"));
const Experience = lazy(import("#lib/components/Experience.svelte"));
const AboutSummary = lazy(import("#lib/components/AboutSummary.svelte"));

let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Oliver Walton | Software Engineer</title>
	<meta
		name="description"
		content="Software engineer specialising in systems architecture, homelabbing, and embedded projects."
	>
</svelte:head>

<LandingHero />
<TechStack />
{#await FeaturedWork then FeaturedWork}
	{#if FeaturedWork}
		<FeaturedWork projects={data.projects} blogs={data.blogs} />
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
