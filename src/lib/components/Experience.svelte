<script lang="ts">
import { reveal } from "#lib/actions.ts";
import SectionHeader from "#lib/components/SectionHeader.svelte";
import TabGroup from "#lib/components/TabGroup.svelte";
import BriefcaseIcon from "phosphor-svelte/lib/BriefcaseIcon";
import GraduationCapIcon from "phosphor-svelte/lib/GraduationCapIcon";
import CertificateIcon from "phosphor-svelte/lib/CertificateIcon";
import type { ContentMetadata } from "#lib/content.ts";

type Category = "experience" | "education" | "certifications";

let {
	experience = [],
	education = [],
	certifications = [],
}: Partial<Record<Category, ContentMetadata[]>> = $props();

let activeTab = $state<Category>("experience");

const categories = {
	experience: { label: "Experience", icon: BriefcaseIcon },
	education: { label: "Education", icon: GraduationCapIcon },
	certifications: { label: "Certifications", icon: CertificateIcon },
};

const activeItems = $derived(
	{ experience, education, certifications }[activeTab],
);
const ActiveIcon = $derived(categories[activeTab].icon);
</script>

<section class="border-t border-surface-200-800/80 bg-surface-50-950 py-32">
	<div class="container mx-auto max-w-7xl px-6">
		<SectionHeader title="Background." class="mb-12">
			{#snippet subtitle()}
				Professional journey, education, <br>and certifications.
			{/snippet}
		</SectionHeader>

		<div use:reveal={{ delay: 150 }} class="mb-16">
			<TabGroup
				tabs={Object.entries(categories).map(([id, config]) => ({ id: id as Category, label: config.label }))}
				bind:active={activeTab}
			/>
		</div>

		<!-- Timeline -->
		<div class="relative">
			<div
				class="absolute top-0 left-4 h-full w-px bg-surface-200-800 md:left-8"
			></div>

			<div class="space-y-8">
				{#each activeItems as item, i (item.title + item.organization)}
					<div
						use:reveal={{ delay: 200 + i * 75 }}
						class="relative pl-16 md:pl-20"
					>
						<!-- Timeline Node -->
						<div
							class="absolute top-0 left-4 z-10 flex size-8 -translate-x-1/2 items-center justify-center rounded-full border-2 md:left-8
								{item.current
								? 'border-primary-500 bg-primary-500 text-white'
								: 'border-surface-300-700 bg-surface-50-950 text-surface-500'}"
							aria-hidden="true"
						>
							<ActiveIcon size={14} weight="bold" />
						</div>

						<!-- Content Card -->
						<div
							class="bg-surface-100-800 rounded-2xl border border-surface-200-800 p-6 transition-all hover:border-primary-500/80"
						>
							<div
								class="mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 font-mono text-xs font-bold tracking-wider uppercase
									{item.current
										? 'bg-primary-500/10 text-(--color-primary-500-text)'
										: 'bg-surface-200-700 text-surface-500'}"
							>
								{#if item.current}
									<span
										class="size-1.5 animate-pulse rounded-full bg-primary-500"
									></span>
								{/if}
								{item.period}
							</div>

							<h3
								class="mb-1 font-heading text-xl font-bold text-surface-950-50"
							>
								{item.title}
							</h3>
							<p class="mb-4 text-sm font-semibold text-surface-600-400">
								{item.organization}
							</p>

							<ul
								class="mb-4 space-y-2 text-sm leading-relaxed text-surface-600-400"
							>
								{#each item.highlights ?? [] as bullet (bullet)}
									<li class="flex items-start gap-2">
										<span
											class="mt-2.5 size-1 shrink-0 rounded-full bg-surface-400"
										></span>
										<span>{bullet}</span>
									</li>
								{/each}
							</ul>

							<div class="flex flex-wrap gap-2">
								{#each item.skills ?? [] as skill (skill)}
									<span
										class="rounded-full border border-surface-200-800 px-2.5 py-1 text-[10px] font-bold tracking-wide text-surface-600-400 uppercase"
									>
										{skill}
									</span>
								{/each}
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>
