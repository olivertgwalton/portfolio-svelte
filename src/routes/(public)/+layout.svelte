<script lang="ts">
	import '@fontsource-variable/space-grotesk';
	import '@fontsource-variable/manrope';
	import '@fontsource-variable/jetbrains-mono';
	import Navbar from '$lib/components/Navbar.svelte';

	let { children } = $props();
</script>

<Navbar />
{@render children()}
