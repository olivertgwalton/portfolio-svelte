<script lang="ts">
    import PageHero from "$lib/components/PageHero.svelte";
    import { fly } from "svelte/transition";
    import SocialLinks from "$lib/components/SocialLinks.svelte";
    import ArrowRightIcon from "phosphor-svelte/lib/ArrowRightIcon";
</script>

<svelte:head>
    <title>Contact | Oliver Walton</title>
    <meta
        name="description"
        content="Get in touch via email or social media."
    />
</svelte:head>

<PageHero title="Say Hello.">
    {#snippet subtitle()}
        Open for new projects, <br />and technical discussions.
    {/snippet}
</PageHero>

<section class="bg-surface-50-950 py-24">
    <div class="container mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-[1fr_1fr] lg:gap-32">
        <!-- Left Column: Intro + Email CTA -->
        <div class="space-y-12">
            <div
                class="space-y-6 text-lg leading-relaxed text-surface-800-200"
                in:fly={{ y: 20, duration: 600, delay: 200 }}
            >
                <p>
                    I'm always open to discussing new projects, technical
                    challenges, or simply chatting about Formula 1 and systems
                    architecture.
                </p>

                <p>
                    The best way to reach me is via email or through any of my
                    social profiles below.
                </p>
            </div>

            <!-- Email CTA -->
            <div in:fly={{ y: 20, duration: 600, delay: 300 }}>
                <h2
                    class="mb-4 font-mono text-xs font-bold tracking-widest text-surface-800-200 uppercase"
                >
                    Direct
                </h2>
                <a
                    href="mailto:olivertgwalton03@gmail.com"
                    class="group flex items-center gap-4 border-y border-surface-200-800/80 py-6 transition-colors hover:border-surface-950-50/30"
                >
                    <span class="font-heading text-2xl font-bold text-surface-950-50 md:text-3xl">
                        olivertgwalton03@gmail.com
                    </span>
                    <ArrowRightIcon
                        size={24}
                        weight="bold"
                        class="shrink-0 text-surface-600-400 transition-transform group-hover:translate-x-1"
                    />
                </a>
            </div>
        </div>

        <!-- Right Column: Socials -->
        <div in:fly={{ y: 20, duration: 600, delay: 400 }}>
            <h2
                class="mb-4 font-mono text-xs font-bold tracking-widest text-surface-800-200 uppercase"
            >
                Socials
            </h2>
            <SocialLinks size="lg" />
        </div>
    </div>
</section>
