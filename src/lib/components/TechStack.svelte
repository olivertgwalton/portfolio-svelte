<script lang="ts">
    import type { Component } from "svelte";
    import IconSvelte from "$lib/components/icons/IconSvelte.svelte";
    import IconBun from "$lib/components/icons/IconBun.svelte";
    import IconRust from "$lib/components/icons/IconRust.svelte";
    import IconPython from "$lib/components/icons/IconPython.svelte";
    import IconC from "$lib/components/icons/IconC.svelte";
    import IconLinux from "$lib/components/icons/IconLinux.svelte";
    import IconDocker from "$lib/components/icons/IconDocker.svelte";
    import { reveal } from "$lib/actions";
    import SectionHeader from "$lib/components/SectionHeader.svelte";

    interface IconProps {
        class?: string;
    }

    interface Technology {
        name: string;
        color: string;
        component: Component<IconProps>;
        level: number;
    }

    const technologies: Technology[] = [
        { name: "Svelte", color: "#FF3E00", component: IconSvelte, level: 70 },
        { name: "Bun", color: "#FBF0DF", component: IconBun, level: 80 },
        { name: "Rust", color: "#DEA584", component: IconRust, level: 10 },
        { name: "Python", color: "#3776AB", component: IconPython, level: 65 },
        { name: "C", color: "#A8B9CC", component: IconC, level: 25 },
        { name: "Linux", color: "#FCC624", component: IconLinux, level: 90 },
        { name: "Docker", color: "#2496ED", component: IconDocker, level: 75 },
    ];

    function setupObserver(node: HTMLElement) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("in-view");
                    } else {
                        entry.target.classList.remove("in-view");
                    }
                });
            },
            { threshold: 0.6 },
        );

        const items = node.querySelectorAll(".tech-card");
        items.forEach((item) => observer.observe(item));

        return {
            destroy() {
                observer.disconnect();
            },
        };
    }
</script>

<section class="border-t border-surface-200-800/80 bg-surface-50-950">
    <div
        class="relative z-10 container mx-auto max-w-7xl px-6 pt-32 pb-24 md:pt-40 md:pb-32"
    >
        <SectionHeader title="Technologies." class="mb-16 md:mb-20">
            {#snippet subtitle()}
                The tools I use <br />to build high-performance software.
            {/snippet}
        </SectionHeader>

        <!-- Tech Cards -->
        <ul
            class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 md:gap-8 lg:grid-cols-8"
            use:setupObserver
        >
            {#each technologies as tech, i (tech.name)}
                {@const Icon = tech.component}
                <li
                    use:reveal={{ delay: 200 + i * 50 }}
                    class="tech-card group relative flex h-40 w-full flex-col items-center justify-center gap-4 overflow-hidden rounded-2xl border border-surface-200-800 bg-surface-50-950 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-black/80"
                    style="--tech-color: {tech.color}; --tech-level: {tech.level}%"
                >
                    <!-- Fill Background -->
                    <div class="tech-fill"></div>

                    <!-- Icon Container -->
                    <div
                        class="relative z-10 h-12 w-12 text-surface-600-400 transition-colors duration-300 group-hover:text-(--tech-color)"
                        aria-hidden="true"
                    >
                        <Icon class="h-full w-full" />
                    </div>

                    <!-- Label -->
                    <div
                        class="relative z-10 flex flex-col items-center gap-0.5 text-center"
                    >
                        <span
                            class="font-sans text-[10px] font-bold tracking-widest text-surface-600-400 uppercase transition-colors group-hover:text-surface-950-50"
                        >
                            {tech.name}
                        </span>
                        <span class="sr-only">Proficiency: {tech.level}%</span>
                    </div>
                </li>
            {/each}
        </ul>
    </div>
</section>

<style>
    .tech-fill {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 0%;
        background-color: var(--tech-color);
        opacity: 0.15;
        transition: height 1s ease-out;
    }

    /* Desktop Hover */
    @media (hover: hover) {
        .tech-card:hover .tech-fill {
            height: var(--tech-level);
        }
    }

    /* Mobile/Touch In-View */
    @media (hover: none) {
        :global(.tech-card.in-view) .tech-fill {
            height: var(--tech-level);
        }
    }
</style>
