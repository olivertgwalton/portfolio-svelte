<script lang="ts">
    import { resolve } from "$app/paths";
    import { reveal } from "$lib/actions";
    import type { Collection, ContentMetadata } from "$lib/content";
    import ContentCard from "$lib/components/ContentCard.svelte";
    import TabGroup from "$lib/components/TabGroup.svelte";

    let { projects = [], blogs = [] } = $props<{
        projects: ContentMetadata[];
        blogs: ContentMetadata[];
    }>();

    let collection = $state<Collection>("projects");

    const items = $derived(collection === "projects" ? projects : blogs);
</script>

<section
    class="border-t border-surface-200-800/80 bg-surface-50-950 py-24 md:py-32"
>
    <div class="container mx-auto max-w-7xl px-6">
        <div class="mb-12 space-y-6">
            <h2
                use:reveal={{ delay: 0 }}
                class="font-heading text-5xl font-black tracking-tighter text-surface-950-50 md:text-6xl"
            >
                Selected Work.
            </h2>

            <div
                use:reveal={{ delay: 100 }}
                class="flex items-center justify-between gap-4"
            >
                <TabGroup
                    tabs={[
                        { id: "projects", label: "Projects" },
                        { id: "blogs", label: "Blogs" },
                    ]}
                    bind:active={collection}
                />

                <a
                    href={resolve("/(public)/[collection=collection]", {
                        collection,
                    })}
                    class="shrink-0 text-[10px] font-black tracking-widest text-surface-600-400 uppercase transition-colors hover:text-primary-500"
                >
                    View All {collection === "projects" ? "Projects" : "Blogs"}
                </a>
            </div>
        </div>

        <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {#each items as item, i (item.slug)}
                <div class={i >= 3 ? "hidden sm:block" : ""}>
                    <ContentCard {item} {collection} index={i} />
                </div>
            {:else}
                <div class="col-span-full py-16 text-center">
                    <p
                        class="font-heading text-2xl font-bold text-surface-800-200"
                    >
                        No {collection === "projects" ? "projects" : "blogs"} found.
                    </p>
                </div>
            {/each}
        </div>
    </div>
</section>
