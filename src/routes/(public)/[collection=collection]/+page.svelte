<script lang="ts">
	import ContentList from '$lib/components/pages/ContentList.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

{#key data.type}
	<ContentList items={data.content} type={data.type} />
{/key}
