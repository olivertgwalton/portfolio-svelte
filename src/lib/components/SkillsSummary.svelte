<script lang="ts">
    import { reveal } from "$lib/actions";
    import SectionHeader from "$lib/components/SectionHeader.svelte";

    interface SkillGroup {
        label: string;
        skills: string[];
    }

    const groups: SkillGroup[] = [
        {
            label: "Methodologies",
            skills: ["CI/CD", "Agile", "REST APIs"],
        },
    ];
</script>

<section
    class="border-t border-surface-200-800/80 bg-surface-50-950 py-24 md:py-32"
>
    <div class="container mx-auto max-w-7xl px-6">
        <SectionHeader title="Skills." class="mb-12 md:mb-16">
            {#snippet subtitle()}
                Methodologies and soft skills <br />that complement my technical
                work.
            {/snippet}
        </SectionHeader>

        <div class="grid gap-10 md:grid-cols-2 md:gap-16">
            {#each groups as group, gi (group.label)}
                <div use:reveal={{ delay: 150 + gi * 100 }}>
                    <h3
                        class="mb-4 font-mono text-[10px] font-bold tracking-widest text-surface-500 uppercase md:mb-5 md:text-xs"
                    >
                        {group.label}
                    </h3>

                    <div class="flex flex-wrap gap-2.5">
                        {#each group.skills as skill, i (skill)}
                            <span
                                use:reveal={{ delay: 250 + gi * 100 + i * 50 }}
                                class="rounded-full border border-surface-200-800 bg-surface-100-800 px-4 py-2 text-xs font-bold tracking-wide text-surface-600-400 uppercase transition-colors hover:border-primary-500/60 hover:text-surface-950-50"
                            >
                                {skill}
                            </span>
                        {/each}
                    </div>
                </div>
            {/each}
        </div>
    </div>
</section>
