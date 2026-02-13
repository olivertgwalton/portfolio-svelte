<script lang="ts">
	import { resolve } from '$app/paths';
	import ArrowRightIcon from 'phosphor-svelte/lib/ArrowRightIcon';
	import { reveal } from '$lib/actions';
	import SectionHeader from '$lib/components/SectionHeader.svelte';
	import SocialLinks from '$lib/components/SocialLinks.svelte';
</script>

<section class="border-t border-surface-200-800/80 bg-surface-50-950 py-32">
	<div class="relative z-10 container mx-auto max-w-7xl px-6">
		<SectionHeader title="About Me." class="mb-20">
			{#snippet subtitle()}
				A brief introduction <br>to who I am and what I do.
			{/snippet}
		</SectionHeader>

		<div class="grid gap-20 md:grid-cols-2">
			<!-- Left Column: About/Bio -->
			<div class="space-y-12">
				<div
					use:reveal={{ delay: 200 }}
					class="max-w-xl space-y-8 text-lg leading-relaxed font-medium text-surface-600-400"
				>
					<p>
						I'm a developer who likes building software that works well and looks good. I believe
						good engineering should always serve the people using it.
					</p>
					<p>
						When I'm not working, I'm usually with my family. I also follow Formula 1 closely and
						have a real interest in architecture—basically, I just enjoy seeing how complex things
						are put together, whether it's a race car or a building.
					</p>
				</div>
				<div use:reveal={{ delay: 300 }}>
					<a
						href={resolve('/about')}
						class="inline-flex items-center gap-3 border-b-2 border-surface-950-50 pb-1 text-lg font-bold text-surface-950-50 hover:border-surface-800-200 hover:text-surface-800-200"
					>
						Read full bio <span aria-hidden="true"><ArrowRightIcon size={16} weight="bold" /></span>
					</a>
				</div>
			</div>

			<!-- Right Column: Links & Footer Info -->
			<div class="flex flex-col justify-between space-y-16 md:items-end">
				<div class="space-y-8 md:text-right">
					<h3
						use:reveal={{ delay: 400 }}
						class="font-heading text-3xl font-bold tracking-tight text-surface-950-50"
					>
						Connect.
					</h3>
					<SocialLinks animated />
				</div>

				<div use:reveal={{ delay: 700 }} class="flex flex-col gap-2 md:items-end">
					<div class="font-heading text-2xl font-bold text-surface-950-50">Oliver.</div>
					<div class="text-xs font-medium text-surface-800-200 sm:text-base">
						&copy; {new Date().getFullYear()} Oliver Walton. All rights reserved.
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
