<script lang="ts">
    import { resolve } from "$app/paths";
    import { formatDate } from "$lib/utils";
    import { reveal } from "$lib/actions";
    import MetaTags from "$lib/components/MetaTags.svelte";
    import TableOfContents from "$lib/components/TableOfContents.svelte";
    import ScrollProgress from "$lib/components/ScrollProgress.svelte";
    import ShareWidget from "$lib/components/ShareWidget.svelte";
    import ContentCard from "$lib/components/ContentCard.svelte";
    import type { Component } from "svelte";
    import {
        ArrowLeftIcon,
        ArrowRightIcon,
        GithubLogoIcon,
        GlobeIcon,
        CalendarIcon,
        TagIcon,
        ClockIcon,
    } from "phosphor-svelte";
    import type { Collection, ContentMetadata, ContentType } from "$lib/content";

    import { getEnhancedImage } from "$lib/images";
    import { createTableOfContents } from "$lib/toc.svelte";

    const toc = createTableOfContents();
    toc.init();

    let {
        meta,
        type,
        related = [],
        adjacent = { prev: null, next: null },
        Content,
    }: {
        meta: ContentMetadata;
        type: ContentType;
        related?: ContentMetadata[];
        adjacent?: {
            prev: ContentMetadata | null;
            next: ContentMetadata | null;
        };
        Content: Component | null;
    } = $props();

    const isProject = $derived(type === "projects");
    const collection = $derived<Collection>(isProject ? "projects" : "blogs");
    const postHref = (item: ContentMetadata) =>
        resolve("/(public)/[collection=collection]/[slug]", {
            collection,
            slug: item.slug,
        });
    let featuredImage = $derived(getEnhancedImage(meta.image));
    const ogImage = $derived(
        `/api/og?title=${encodeURIComponent(meta.title)}&description=${encodeURIComponent(meta.description)}`,
    );
</script>

<MetaTags
    title={meta.title}
    description={meta.description}
    type={isProject ? "website" : "article"}
    image={ogImage}
/>

<ScrollProgress />

<article class="bg-surface-50-950 pb-32">
    <header class="border-b border-surface-200-800/80 pt-32 pb-16">
        <div class="container mx-auto max-w-7xl px-6">
            <a
                use:reveal={{ delay: 0, y: 10 }}
                href={resolve("/(public)/[collection=collection]", {
                    collection: isProject ? "projects" : "blogs",
                })}
                class="mb-8 inline-flex items-center gap-2 text-sm font-bold text-surface-600-400 hover:text-primary-500"
            >
                <span aria-hidden="true"><ArrowLeftIcon size={16} /></span> BACK
                TO {isProject ? "PROJECTS" : "BLOGS"}
            </a>

            <div class="grid gap-12 lg:grid-cols-[1fr_auto] lg:items-center">
                <div class="max-w-3xl">
                    {#if meta.type}
                        <span
                            class="mb-4 block font-mono text-sm font-bold tracking-widest text-(--color-primary-500-text) uppercase"
                        >
                            {meta.type}
                        </span>
                    {:else}
                        <span
                            class="mb-4 block font-mono text-sm font-bold tracking-widest text-(--color-primary-500-text) uppercase"
                        >
                            {isProject ? "Project" : "Blog"}
                        </span>
                    {/if}
                    <h1
                        class="font-heading text-5xl font-black tracking-tighter text-surface-950-50 md:text-7xl"
                    >
                        {meta.title}
                    </h1>
                    <p
                        class="mt-6 text-xl leading-relaxed text-surface-800-200"
                    >
                        {meta.description}
                    </p>

                    <div
                        class="mt-8 flex flex-wrap gap-x-8 gap-y-4 text-sm text-surface-600-400"
                    >
                        <div class="flex items-center gap-2">
                            <span aria-hidden="true"
                                ><CalendarIcon size={18} /></span
                            >
                            <span class="font-bold"
                                >{formatDate(meta.date)}</span
                            >
                        </div>
                        {#if meta.readTime}
                            <div class="flex items-center gap-2">
                                <span aria-hidden="true"
                                    ><ClockIcon size={18} /></span
                                >
                                <span class="font-bold">{meta.readTime}</span>
                            </div>
                        {/if}
                        {#if isProject && meta.tech}
                            <div class="flex items-center gap-2">
                                <span aria-hidden="true"
                                    ><TagIcon size={18} /></span
                                >
                                <div class="flex flex-wrap gap-2">
                                    {#each meta.tech as t (t)}
                                        <span
                                            class="rounded-full border border-surface-200-800 px-2.5 py-1 text-[10px] font-bold uppercase"
                                        >
                                            {t}
                                        </span>
                                    {/each}
                                </div>
                            </div>
                        {/if}
                        {#if isProject}
                            {#if meta.demo}
                                <a
                                    href={meta.demo}
                                    target="_blank"
                                    title="Live Demo (opens in new window)"
                                    rel="external noreferrer"
                                    class="flex items-center gap-2 font-bold transition-colors hover:text-primary-500"
                                >
                                    <span aria-hidden="true"
                                        ><GlobeIcon size={18} /></span
                                    > Live Demo
                                </a>
                            {/if}
                            {#if meta.source}
                                <a
                                    href={meta.source}
                                    target="_blank"
                                    title="Source Code (opens in new window)"
                                    rel="external noreferrer"
                                    class="flex items-center gap-2 font-bold transition-colors hover:text-primary-500"
                                >
                                    <span aria-hidden="true"
                                        ><GithubLogoIcon size={18} /></span
                                    > Source Code
                                </a>
                            {/if}
                        {/if}
                    </div>
                </div>

                {#if featuredImage}
                    <div
                        class="aspect-video w-full max-w-xl overflow-hidden rounded-3xl border border-surface-200-800 shadow-2xl"
                    >
                        <enhanced:img
                            src={featuredImage}
                            alt={meta.title}
                            fetchpriority="high"
                            loading="eager"
                            class="h-full w-full object-cover"
                        />
                    </div>
                {/if}
            </div>
        </div>
    </header>

    <div class="container mx-auto max-w-7xl px-6 pt-20">
        <div class="grid gap-16 lg:grid-cols-[1fr_240px]">
            <div class="min-w-0 w-full">
                <div
                    class="prose prose-sm max-w-none sm:prose-base md:prose-lg dark:prose-invert prose-headings:font-heading prose-headings:font-black prose-headings:text-surface-950-50 prose-p:text-surface-800-200 prose-a:text-primary-600 dark:prose-a:text-primary-400 prose-strong:text-surface-950-50 prose-code:font-mono prose-code:text-primary-700 dark:prose-code:text-primary-400 prose-li:text-surface-800-200"
                >
                    <div>
                        <TableOfContents
                            layout="collapsible"
                            headings={toc.headings}
                            activeId={toc.activeId}
                            onNavigate={toc.scrollToHeading}
                        />
                    </div>
                    {#if Content}
                        <Content />
                    {:else}
                        <p class="animate-pulse font-bold text-surface-400">
                            Loading...
                        </p>
                    {/if}
                </div>
                {#if Content}
                    <ShareWidget title={meta.title} />
                {/if}
            </div>
            <aside class="hidden lg:block">
                <div class="sticky top-8">
                    <TableOfContents
                        headings={toc.headings}
                        activeId={toc.activeId}
                        onNavigate={toc.scrollToHeading}
                    />
                </div>
            </aside>
        </div>

        {#if adjacent.prev ?? adjacent.next}
            <nav
                aria-label="{isProject ? 'Project' : 'Blog'} navigation"
                class="mt-16 grid gap-4 border-t border-surface-200-800 pt-12 sm:grid-cols-2"
            >
                {#if adjacent.prev}
                    <a
                        href={postHref(adjacent.prev)}
                        rel="prev"
                        class="group flex flex-col gap-2 rounded-2xl border border-surface-200-800 p-6 transition-all hover:-translate-y-0.5 hover:border-primary-500/60 hover:bg-surface-100-900"
                    >
                        <span
                            class="flex items-center gap-2 font-mono text-xs font-bold tracking-widest text-surface-600-400 uppercase"
                        >
                            <span aria-hidden="true"
                                ><ArrowLeftIcon size={14} weight="bold" /></span
                            >
                            Previous
                        </span>
                        <span
                            class="font-heading text-lg font-bold text-surface-950-50 transition-colors group-hover:text-primary-500"
                        >
                            {adjacent.prev.title}
                        </span>
                    </a>
                {:else}
                    <div class="hidden sm:block"></div>
                {/if}

                {#if adjacent.next}
                    <a
                        href={postHref(adjacent.next)}
                        rel="next"
                        class="group flex flex-col gap-2 rounded-2xl border border-surface-200-800 p-6 text-right transition-all hover:-translate-y-0.5 hover:border-primary-500/60 hover:bg-surface-100-900 sm:items-end"
                    >
                        <span
                            class="flex items-center gap-2 font-mono text-xs font-bold tracking-widest text-surface-600-400 uppercase"
                        >
                            Next
                            <span aria-hidden="true"
                                ><ArrowRightIcon
                                    size={14}
                                    weight="bold"
                                /></span
                            >
                        </span>
                        <span
                            class="font-heading text-lg font-bold text-surface-950-50 transition-colors group-hover:text-primary-500"
                        >
                            {adjacent.next.title}
                        </span>
                    </a>
                {/if}
            </nav>
        {/if}

        {#if related.length > 0}
            <section class="mt-16 border-t border-surface-200-800 pt-12">
                <h2
                    class="font-heading text-2xl font-black tracking-tight text-surface-950-50"
                >
                    Related {isProject ? "Projects" : "Blogs"}
                </h2>
                <div class="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {#each related as item (item.slug)}
                        <ContentCard
                            {item}
                            collection={isProject ? "projects" : "blogs"}
                            variant="compact"
                        />
                    {/each}
                </div>
            </section>
        {/if}
    </div>
</article>
