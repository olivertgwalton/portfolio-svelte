<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';
	import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';
	import MetaTags from '$lib/components/MetaTags.svelte';

	injectAnalytics();
	injectSpeedInsights();
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<MetaTags />

{@render children()}
