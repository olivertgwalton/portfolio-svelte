<script>
	import { resolve } from '$app/paths';
	import { reveal } from '$lib/actions';
	import ArrowRight from 'phosphor-svelte/lib/ArrowRight';
	import ArrowUpRight from 'phosphor-svelte/lib/ArrowUpRight';
</script>

<section class="border-t border-stone-200 bg-(--color-base) px-6 py-32 dark:border-stone-800">
	<div class="relative z-10 container mx-auto max-w-7xl">
		<!-- Header: Consistent with previous sections -->
		<div class="mb-20 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
			<div>
				<h2
					class="font-serif text-5xl font-black tracking-tighter text-black md:text-6xl dark:text-white"
				>
					About Me.
				</h2>
			</div>
			<p
				class="hidden max-w-xs text-right text-sm font-bold tracking-wide text-stone-600 md:block dark:text-stone-400"
			>
				A brief introduction <br />to who I am and what I do.
			</p>
		</div>

		<div class="grid gap-20 md:grid-cols-2">
			<!-- Left Column: About/Bio -->
			<div class="space-y-12" use:reveal={{ delay: 0 }}>
				<div
					class="max-w-xl space-y-8 text-lg leading-relaxed font-medium text-stone-600 dark:text-stone-400"
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
				<a
					href={resolve('/about')}
					class="inline-flex items-center gap-3 border-b-2 border-stone-900 pb-1 text-lg font-bold text-stone-900 transition-colors hover:border-stone-600 hover:text-stone-700 dark:border-stone-100 dark:text-stone-100 dark:hover:border-stone-400 dark:hover:text-stone-300"
				>
					Read full bio <ArrowRight size={16} weight="bold" />
				</a>
			</div>

			<!-- Right Column: Links & Footer Info -->
			<div
				class="flex flex-col justify-between space-y-16 md:items-end"
				use:reveal={{ delay: 200 }}
			>
				<div class="space-y-8 md:text-right">
					<h3
						class="font-serif text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-100"
					>
						Connect.
					</h3>
					<ul class="space-y-4 text-lg font-medium text-stone-600 dark:text-stone-400">
						<li>
							<a
								href="https://github.com/olivertgwalton"
								target="_blank"
								rel="noopener noreferrer"
								class="flex items-center gap-2 transition-colors hover:text-stone-900 md:justify-end dark:hover:text-stone-100"
							>
								Github <ArrowUpRight size={16} class="opacity-50" />
							</a>
						</li>
						<li>
							<a
								href="https://www.linkedin.com/in/oliver-walton03/"
								target="_blank"
								rel="noopener noreferrer"
								class="flex items-center gap-2 transition-colors hover:text-stone-900 md:justify-end dark:hover:text-stone-100"
							>
								LinkedIn <ArrowUpRight size={16} class="opacity-50" />
							</a>
						</li>
						<li>
							<a
								href="https://instagram.com/olivertgwalton03"
								target="_blank"
								rel="noopener noreferrer"
								class="flex items-center gap-2 transition-colors hover:text-stone-900 md:justify-end dark:hover:text-stone-100"
							>
								Instagram <ArrowUpRight size={16} class="opacity-50" />
							</a>
						</li>
					</ul>
				</div>

				<div class="flex flex-col gap-2 md:items-end">
					<div class="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100">
						Oliver.
					</div>
					<div class="text-sm font-medium text-stone-400 dark:text-stone-600">
						&copy; {new Date().getFullYear()} Oliver Walton. All rights reserved.
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
