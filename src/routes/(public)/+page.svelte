<script lang="ts">
	import LandingHero from '$lib/components/LandingHero.svelte';
	import FeaturedWork from '$lib/components/FeaturedWork.svelte';
	import AboutSummary from '$lib/components/AboutSummary.svelte';
	import TechStack from '$lib/components/TechStack.svelte';
	import Experience from '$lib/components/Experience.svelte';

	let { data } = $props();
</script>

<LandingHero />
<TechStack />
<FeaturedWork projects={data.projects} posts={data.posts} />
<Experience
	experience={data.experience}
	education={data.education}
	certifications={data.certifications}
/>

<AboutSummary />
