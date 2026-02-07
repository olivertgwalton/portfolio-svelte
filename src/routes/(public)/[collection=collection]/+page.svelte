<script lang="ts">
	import ContentList from '$lib/components/pages/ContentList.svelte';

	let { data } = $props();
</script>

{#key data.type}
	<ContentList items={data.content} type={data.type} />
{/key}
