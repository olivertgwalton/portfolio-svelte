<script lang="ts">
	import ContentPost from '$lib/components/pages/ContentPost.svelte';

	let { data } = $props();
</script>

<ContentPost meta={data.meta} slug={data.slug} type={data.type} related={data.related} />
