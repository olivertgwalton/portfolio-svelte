<script lang="ts">
import { page } from "$app/state";
import { siteConfig } from "#lib/site.config.ts";

interface Props {
	title?: string;
	description?: string;
	image?: string;
	type?: string;
}

let {
	title = siteConfig.title,
	description = siteConfig.description,
	image = siteConfig.ogImage,
	type = "website",
}: Props = $props();

// Use the actual current URL from SvelteKit's state for deployment
const url = $derived(page.url.href);

// Social platforms require an absolute image URL
const absoluteImage = $derived(new URL(image, siteConfig.url).href);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description}>
	<meta name="keywords" content={siteConfig.keywords.join(', ')}>
	<meta name="author" content={siteConfig.author}>

	<!-- Open Graph -->
	<meta property="og:site_name" content={siteConfig.title}>
	<meta property="og:type" content={type}>
	<meta property="og:title" content={title}>
	<meta property="og:description" content={description}>
	<meta property="og:url" content={url}>
	<meta property="og:image" content={absoluteImage}>
	<meta property="og:image:width" content="1200">
	<meta property="og:image:height" content="630">
	<meta property="og:image:type" content="image/png">

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image">
	<meta name="twitter:title" content={title}>
	<meta name="twitter:description" content={description}>
	<meta name="twitter:image" content={absoluteImage}>
</svelte:head>
