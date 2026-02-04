<script lang="ts">
	import type { Component } from 'svelte';
	import IconSvelte from '$lib/components/icons/IconSvelte.svelte';
	import IconTypeScript from '$lib/components/icons/IconTypeScript.svelte';
	import IconTailwind from '$lib/components/icons/IconTailwind.svelte';
	import IconNode from '$lib/components/icons/IconNode.svelte';
	import IconRust from '$lib/components/icons/IconRust.svelte';
	import IconPython from '$lib/components/icons/IconPython.svelte';
	import IconC from '$lib/components/icons/IconC.svelte';
	import IconLinux from '$lib/components/icons/IconLinux.svelte';
	import { reveal } from '$lib/actions';

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
		{ name: 'Svelte', color: '#FF3E00', component: IconSvelte, level: 70 },
		{ name: 'TypeScript', color: '#3178C6', component: IconTypeScript, level: 75 },
		{ name: 'Tailwind CSS', color: '#06B6D4', component: IconTailwind, level: 85 },
		{ name: 'Node.js', color: '#339933', component: IconNode, level: 80 },
		{ name: 'Rust', color: '#DEA584', component: IconRust, level: 10 },
		{ name: 'Python', color: '#3776AB', component: IconPython, level: 65 },
		{ name: 'C', color: '#A8B9CC', component: IconC, level: 25 },
		{ name: 'Linux', color: '#FCC624', component: IconLinux, level: 90 }
	];

	function setupObserver(node: HTMLElement) {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add('in-view');
					} else {
						entry.target.classList.remove('in-view');
					}
				});
			},
			{ threshold: 0.6 }
		);

		// Observe all direct children (li elements)
		const items = node.querySelectorAll('.tech-card');
		items.forEach((item) => observer.observe(item));

		return {
			destroy() {
				observer.disconnect();
			}
		};
	}
</script>

<section class="border-t border-border bg-(--color-base) dark:border-stone-800">
	<div class="relative z-10 container mx-auto max-w-7xl px-6 py-32">
		<!-- Header: Matching Blog/Projects Design -->
		<div class="mb-20 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
			<div>
				<h2
					use:reveal={{ delay: 0, y: 20 }}
					class="font-heading text-5xl font-black tracking-tighter text-primary md:text-6xl dark:text-white"
				>
					Technologies.
				</h2>
			</div>
			<p
				use:reveal={{ delay: 100, y: 20 }}
				class="hidden max-w-xs text-right text-sm font-bold tracking-wide text-muted md:block dark:text-muted"
			>
				The tools I use <br />to build high-performance software.
			</p>
		</div>

		<ul class="flex flex-wrap justify-start gap-6 md:gap-8" use:setupObserver>
			{#each technologies as tech, i (tech.name)}
				{@const Icon = tech.component}
				<li
					use:reveal={{ delay: i * 50, y: 20 }}
					class="tech-card group relative flex h-32 w-32 flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border border-stone-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-stone-800 dark:bg-surface dark:hover:shadow-2xl dark:hover:shadow-black/50"
					style="--tech-color: {tech.color}; --tech-level: {tech.level}%"
				>
					<!-- Fill Background -->
					<div class="tech-fill"></div>

					<!-- Icon Container -->
					<div
						class="relative z-10 h-12 w-12 text-muted transition-colors duration-300 group-hover:text-(--tech-color) dark:text-muted"
						aria-hidden="true"
					>
						<Icon class="h-full w-full" />
					</div>

					<!-- Label -->
					<div class="relative z-10 flex flex-col items-center gap-0.5 text-center">
						<span
							class="font-sans text-[10px] font-bold tracking-widest text-muted uppercase transition-colors group-hover:text-primary dark:text-muted dark:group-hover:text-stone-200"
							style="background-color: transparent;"
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
