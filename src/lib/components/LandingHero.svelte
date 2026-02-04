<script lang="ts">
	import { resolve } from '$app/paths';
	import me from '$lib/assets/me.jpg?enhanced';
	import ArrowDown from 'phosphor-svelte/lib/ArrowDown';
	import InteractiveGrid from '$lib/components/visuals/InteractiveGrid.svelte';
	import { reveal } from '$lib/actions';
</script>

<section
	class="relative flex min-h-[80vh] w-full items-center justify-center overflow-hidden border-b border-border dark:border-border"
>
	<InteractiveGrid />
	<div class="relative z-10 container mx-auto px-6 md:px-12">
		<!-- Top Row: Content & Image aligned at the bottom -->

		<div class="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-20">
			<!-- Text Content -->

			<div class="flex flex-col items-start text-left lg:col-span-7">
				<!-- Badge -->

				<div
					use:reveal={{ delay: 0, y: 20 }}
					class="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-white/80 px-4 py-1.5 shadow-sm backdrop-blur-sm dark:border-stone-700 dark:bg-stone-800/80"
				>
					<span
						class="text-xs font-bold tracking-widest text-primary"
					>
						<span role="img" aria-label="United Kingdom">🇬🇧</span> Based in the UK
					</span>
				</div>

				<!-- Headline -->

				<h1
					use:reveal={{ delay: 100, y: 20 }}
					class="mb-8 font-heading leading-[0.9] font-black tracking-tighter text-primary"
				>
					<span class="block text-5xl md:text-8xl"> Oliver Walton. </span>

					<span
						class="mt-2 block text-2xl font-bold text-secondary md:text-4xl dark:text-muted"
					>
						Software Engineer.
					</span>
				</h1>

				<!-- Bio -->

				<p
					use:reveal={{ delay: 200, y: 20 }}
					class="max-w-xl font-sans text-lg leading-relaxed font-medium text-stone-800 dark:text-stone-300"
				>
					British developer with a focus on design and performance. Specialising in

					<strong
						class="font-extrabold text-primary underline decoration-(--color-accent-pop) decoration-4 underline-offset-4 dark:text-white"
						>Frontend Architecture</strong
					>,

					<strong class="font-extrabold text-primary">Linux Systems</strong>, and

					<strong class="font-extrabold text-primary">Embedded Development</strong>.
				</p>

				<!-- Buttons -->

				<div use:reveal={{ delay: 300, y: 20 }} class="mt-10 flex flex-wrap gap-5">
					<a
						href={resolve('/contact')}
						class="inline-flex items-center justify-center border-2 border-black px-8 py-4 text-sm font-bold tracking-wider text-primary uppercase transition-colors hover:bg-black hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-primary"
					>
						Contact
					</a>
				</div>
			</div>

			<!-- Visual Column -->

			<div use:reveal={{ delay: 400, y: 30 }} class="relative hidden lg:col-span-5 lg:block">
				<div class="group relative mx-auto aspect-3/4 w-full max-w-sm">
					<!-- Glass Background/Frame -->
					<div
						class="absolute -inset-4 rounded-3xl border border-border/50 bg-white/30 backdrop-blur-xl transition-all duration-500 group-hover:-inset-6 group-hover:bg-white/40 dark:border-stone-700/50 dark:bg-surface/30 dark:group-hover:bg-surface/40"
					></div>

					<!-- Image Container -->
					<div
						class="relative h-full w-full overflow-hidden rounded-2xl shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]"
					>
						<enhanced:img
							src={me}
							alt="Oliver Walton"
							class="h-full w-full object-cover transition-all duration-700"
						/>

						<!-- Overlay Gradient for depth -->
						<div
							class="absolute inset-0 bg-linear-to-t from-stone-900/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
						></div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Scroll Indicator -->
	<div
		use:reveal={{ delay: 600, y: -10 }}
		class="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted dark:text-secondary"
	>
		<span class="block animate-bounce">
			<ArrowDown size={24} weight="bold" />
		</span>
	</div>
</section>
