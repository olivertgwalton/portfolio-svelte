<script lang="ts">
	import { resolve } from '$app/paths';
	import ArrowRightIcon from 'phosphor-svelte/lib/ArrowRightIcon';
	import ArrowUpRightIcon from 'phosphor-svelte/lib/ArrowUpRightIcon';
	import { reveal } from '$lib/actions';
</script>

<section class="border-t border-surface-200-800/80 bg-surface-50-950 py-32">
	<div class="relative z-10 container mx-auto max-w-7xl px-6">
		<!-- Header -->
		<div class="mb-20 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
			<div>
				<h2
					use:reveal={{ delay: 0 }}
					class="font-heading text-5xl font-black tracking-tighter text-surface-950-50 md:text-6xl"
				>
					About Me.
				</h2>
			</div>
			<div class="hidden md:block">
				<p
					use:reveal={{ delay: 100 }}
					class="hidden max-w-xs text-right text-sm font-bold tracking-wide text-surface-600-400 md:block"
				>
					A brief introduction <br>to who I am and what I do.
				</p>
			</div>
		</div>

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
						Read full bio <ArrowRightIcon size={16} weight="bold" />
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
					<ul class="space-y-4 text-lg font-medium text-surface-800-200">
						<li use:reveal={{ delay: 450 }}>
							<a
								href="https://github.com/olivertgwalton"
								target="_blank"
								rel="noopener noreferrer"
								class="flex items-center gap-2 transition-colors hover:text-surface-950-50 md:justify-end"
							>
								Github <ArrowUpRightIcon size={16} class="opacity-50" />
							</a>
						</li>
						<li use:reveal={{ delay: 500 }}>
							<a
								href="https://www.linkedin.com/in/oliver-walton03/"
								target="_blank"
								rel="noopener noreferrer"
								class="flex items-center gap-2 transition-colors hover:text-surface-950-50 md:justify-end"
							>
								LinkedIn <ArrowUpRightIcon size={16} class="opacity-50" />
							</a>
						</li>
						<li use:reveal={{ delay: 550 }}>
							<a
								href="https://t.me/oliverwalton03"
								target="_blank"
								rel="noopener noreferrer"
								class="flex items-center gap-2 transition-colors hover:text-surface-950-50 md:justify-end"
							>
								Telegram <ArrowUpRightIcon size={16} class="opacity-50" />
							</a>
						</li>
						<li use:reveal={{ delay: 600 }}>
							<a
								href="https://instagram.com/olivertgwalton03"
								target="_blank"
								rel="noopener noreferrer"
								class="flex items-center gap-2 transition-colors hover:text-surface-950-50 md:justify-end"
							>
								Instagram <ArrowUpRightIcon size={16} class="opacity-50" />
							</a>
						</li>
					</ul>
				</div>

				<div use:reveal={{ delay: 700 }} class="flex flex-col gap-2 md:items-end">
					<div class="font-heading text-2xl font-bold text-surface-950-50">Oliver.</div>
					<div class="text-sm font-medium text-surface-800-200">
						&copy; {new Date().getFullYear()} Oliver Walton. All rights reserved.
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
