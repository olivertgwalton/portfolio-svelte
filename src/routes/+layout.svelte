<script lang="ts">
    import "./layout.css";
    import "@fontsource-variable/space-grotesk/index.css";
    import "@fontsource-variable/manrope/index.css";
    import "@fontsource-variable/jetbrains-mono/index.css";
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
