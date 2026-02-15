<script lang="ts">
    let scrollY = $state(0);
    let innerHeight = $state(0);
    let scrollHeight = $state(0);

    $effect(() => {
        const update = () => {
            scrollHeight = document.documentElement.scrollHeight;
        };
        update();

        const observer = new ResizeObserver(update);
        observer.observe(document.documentElement);
        return () => observer.disconnect();
    });

    const progress = $derived(
        scrollHeight <= innerHeight
            ? 0
            : scrollY / (scrollHeight - innerHeight),
    );
</script>

<svelte:window bind:scrollY bind:innerHeight />

<div
    class="pointer-events-none fixed top-0 left-0 z-60 h-1 w-full bg-transparent"
>
    <div
        class="h-full bg-primary-500 will-change-[width]"
        style:width="{Math.min(progress * 100, 100)}%"
    ></div>
</div>
