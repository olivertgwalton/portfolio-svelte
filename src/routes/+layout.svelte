<script lang="ts">
	import './layout.css';
	import '@fontsource-variable/space-grotesk';
	import '@fontsource-variable/manrope';
	import '@fontsource-variable/jetbrains-mono';
	import favicon from '$lib/assets/favicon.svg';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';
	import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';
	import MetaTags from '$lib/components/MetaTags.svelte';
	import Navbar from '$lib/components/Navbar.svelte';

	injectAnalytics();
	injectSpeedInsights();
	let { children, data } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<MetaTags />

<div class="flex min-h-screen flex-col">
	<Navbar theme={data.theme} mode={data.mode} />
	<main class="grow">
		{@render children()}
	</main>
</div>
