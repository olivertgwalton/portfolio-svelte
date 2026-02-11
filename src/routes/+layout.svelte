<script lang="ts">
	import './layout.css';
	import '@fontsource-variable/space-grotesk';
	import '@fontsource-variable/manrope';
	import '@fontsource-variable/jetbrains-mono';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';
	import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';
	import MetaTags from '$lib/components/MetaTags.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import BackToTop from '$lib/components/BackToTop.svelte';

	injectAnalytics();
	injectSpeedInsights();
	let { children, data } = $props();
</script>

<svelte:head>
	<link rel="icon" href="/favicon.svg" />
</svelte:head>

<MetaTags />

<div class="flex min-h-screen flex-col">
	<Navbar theme={data.theme} mode={data.mode} />
	<main class="grow">
		{@render children()}
	</main>
	<BackToTop />
</div>
