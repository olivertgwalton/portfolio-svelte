<script lang="ts">
import Icon from "#lib/components/icons/Icon.svelte";
import IconPython from "#lib/components/icons/IconPython.svelte";
import type { IconName } from "#lib/components/icons/icons";
import { reveal } from "#lib/actions";
import SectionHeader from "#lib/components/SectionHeader.svelte";

interface Technology {
	name: string;
	color: string;
	icon: IconName | "python";
}

interface SkillCategory {
	label: string;
	items: Technology[];
}

const techCategories: SkillCategory[] = [
	{
		label: "Languages",
		items: [
			{ name: "TypeScript", color: "#3178C6", icon: "TypeScript" },
			{ name: "Python", color: "#3776AB", icon: "python" },
			{ name: "Rust", color: "#DEA584", icon: "Rust" },
			{ name: "C", color: "#A8B9CC", icon: "C" },
		],
	},
	{
		label: "Frameworks & Runtimes",
		items: [
			{ name: "Svelte", color: "#FF3E00", icon: "Svelte" },
			{ name: "Bun", color: "#F6DECE", icon: "Bun" },
			{ name: "Tailwind", color: "#06B6D4", icon: "Tailwind" },
		],
	},
	{
		label: "Tools & Platforms",
		items: [
			{ name: "Linux", color: "#FCC624", icon: "Linux" },
			{ name: "Docker", color: "#2496ED", icon: "Docker" },
			{ name: "Git", color: "#F05032", icon: "Git" },
			{ name: "GitHub", color: "#8B949E", icon: "GitHub" },
			{ name: "PostgreSQL", color: "#4169E1", icon: "Postgres" },
			{ name: "SQLite", color: "#003B57", icon: "SQLite" },
			{ name: "Vercel", color: "#8B8B8B", icon: "Vercel" },
		],
	},
];
</script>

<section class="border-t border-surface-200-800/80 bg-surface-50-950">
	<div
		class="relative z-10 container mx-auto max-w-7xl px-6 pt-32 pb-24 md:pt-40 md:pb-32"
	>
		<SectionHeader title="Technologies." class="mb-16 md:mb-20">
			{#snippet subtitle()}
				The tools I use <br>to build high-performance software.
			{/snippet}
		</SectionHeader>

		<div class="space-y-10 md:space-y-12">
			<!-- Tech categories with icons -->
			{#each techCategories as category, ci (category.label)}
				<div use:reveal={{ delay: 100 + ci * 75 }}>
					<h3
						class="mb-4 font-mono text-[10px] font-bold tracking-widest text-surface-600-400 uppercase md:mb-5 md:text-xs"
					>
						{category.label}
					</h3>

					<div class="flex flex-wrap gap-3">
						{#each category.items as tech, i (tech.name)}
							<div
								use:reveal={{ delay: 150 + ci * 75 + i * 40 }}
								class="tech-pill group inline-flex items-center gap-3 rounded-xl border border-surface-200-800 bg-surface-50-950 px-5 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:hover:shadow-black/60"
								style="--tech-color: {tech.color}"
							>
								<!-- Icon with colored background circle on hover -->
								<div
									class="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-surface-200-800/50 transition-all duration-300 group-hover:bg-(--tech-color)/15"
								>
									<div
										class="h-4 w-4 text-surface-500 transition-colors duration-300 group-hover:text-(--tech-color)"
										aria-hidden="true"
									>
										{#if tech.icon === 'python'}
											<IconPython class="h-full w-full" />
										{:else}
											<Icon name={tech.icon} class="h-full w-full" />
										{/if}
									</div>
								</div>
								<span
									class="text-xs font-bold tracking-wide text-surface-600-400 uppercase transition-colors duration-300 group-hover:text-surface-950-50"
								>
									{tech.name}
								</span>
							</div>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
.tech-pill {
	border-color: var(--color-surface-200, oklch(0.885 0 0));
}

:global(.dark) .tech-pill {
	border-color: oklch(0.3 0 0 / 0.8);
}

.tech-pill:hover {
	border-color: color-mix(in oklch, var(--tech-color) 40%, transparent);
}
</style>
