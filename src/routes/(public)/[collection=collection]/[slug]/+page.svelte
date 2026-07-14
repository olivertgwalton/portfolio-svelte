<script lang="ts">
	import ContentPost from '$lib/components/pages/ContentPost.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<ContentPost
	meta={data.meta}
	type={data.type}
	related={data.related}
	adjacent={data.adjacent}
	Content={data.Content}
/>
