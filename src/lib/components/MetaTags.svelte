<script lang="ts">
	import { page } from '$app/state';
	import { siteConfig } from '$lib/site.config';

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
		type = 'website'
	}: Props = $props();

	// Use the actual current URL from SvelteKit's state for deployment
	const url = $derived(page.url.href);

	// Ensure the image URL is absolute (required by most social platforms)
	// Robust slash handling: remove trailing slash from base and leading from path
	const baseUrl = siteConfig.url.replace(/\/$/, '');
	const imagePath = $derived(image.startsWith('/') ? image.substring(1) : image);
	const absoluteImage = $derived(image.startsWith('http') ? image : `${baseUrl}/${imagePath}`);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta name="keywords" content={siteConfig.keywords.join(', ')} />
	<meta name="author" content={siteConfig.author} />

	<!-- Open Graph -->
	<meta property="og:site_name" content={siteConfig.title} />
	<meta property="og:type" content={type} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={url} />
	<meta property="og:image" content={absoluteImage} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:type" content="image/png" />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={absoluteImage} />
</svelte:head>
