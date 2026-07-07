<script lang="ts">
	import ContentPost from '$lib/components/pages/ContentPost.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<ContentPost meta={data.meta} slug={data.slug} type={data.type} related={data.related} />
