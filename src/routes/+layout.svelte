<script lang="ts">
    import "./layout.css";
    import "@fontsource-variable/space-grotesk";
    import "@fontsource-variable/manrope";
    import "@fontsource-variable/jetbrains-mono";
    import Navbar from "$lib/components/Navbar.svelte";
    import BackToTop from "$lib/components/BackToTop.svelte";
    import { setThemeContext } from "$lib/theme.svelte";
    import { untrack } from "svelte";

    let { children, data } = $props();

    const theme = untrack(() => setThemeContext(data.theme, data.mode));
    theme.initClient();
</script>

<svelte:head>
    <link rel="icon" href="/favicon.svg" />
</svelte:head>

<div class="flex min-h-screen flex-col">
    <Navbar />
    <main class="grow">
        {@render children()}
    </main>
    <BackToTop />
</div>
