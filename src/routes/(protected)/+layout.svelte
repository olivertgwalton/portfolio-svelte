<script lang="ts">
	import '@fontsource-variable/space-grotesk';
	import '@fontsource-variable/manrope';
	import '@fontsource-variable/jetbrains-mono';
	import { Toaster } from 'svelte-sonner';
	import Navbar from '$lib/components/Navbar.svelte';

	let { children } = $props();
</script>

<Navbar />
<Toaster position="bottom-right" richColors />

{@render children()}
