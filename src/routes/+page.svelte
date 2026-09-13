<script lang="ts">
import LandingHero from "#lib/components/LandingHero.svelte";
import TechStack from "#lib/components/TechStack.svelte";
import FeaturedWork from "#lib/components/FeaturedWork.svelte";
import Experience from "#lib/components/Experience.svelte";
import AboutSummary from "#lib/components/AboutSummary.svelte";
import type { PageProps } from "./$types";

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
<FeaturedWork projects={data.projects} blogs={data.blogs} />
<Experience
	experience={data.experience}
	education={data.education}
	certifications={data.certifications}
/>
<AboutSummary />
