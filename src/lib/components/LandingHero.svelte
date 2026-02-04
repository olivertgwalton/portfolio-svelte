<script lang="ts">
	import { resolve } from '$app/paths';
	import me from '$lib/assets/me.jpg?enhanced';
	import InteractiveGrid from '$lib/components/visuals/InteractiveGrid.svelte';
	import ArrowDown from 'phosphor-svelte/lib/ArrowDown';
</script>

<section
	class="relative flex min-h-[80vh] w-full items-center justify-center overflow-hidden border-b border-stone-900/10 dark:border-stone-100/10"
>
	<InteractiveGrid />

	<div class="relative z-10 container mx-auto px-6 md:px-12">
		<!-- Top Row: Content & Image aligned at the bottom -->

		<div class="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-20">
			<!-- Text Content -->

			<div class="flex flex-col items-start text-left lg:col-span-7">
				<!-- Badge -->

				<div
					class="mb-8 inline-flex items-center gap-2 rounded-full border border-stone-900/10 bg-white/80 px-4 py-1.5 shadow-sm backdrop-blur-sm dark:border-stone-700 dark:bg-stone-800/80"
				>
					<span
						class="text-xs font-bold tracking-widest text-stone-900 uppercase dark:text-stone-100"
					>
						<span role="img" aria-label="United Kingdom">🇬🇧</span> Based in the UK
					</span>
				</div>

				<!-- Headline -->

				<h1
					class="mb-8 font-serif leading-[0.9] font-black tracking-tighter text-black dark:text-white"
				>
					<span class="block text-5xl md:text-8xl"> Oliver Walton. </span>

					<span
						class="mt-2 block text-2xl font-bold text-stone-600 md:text-4xl dark:text-stone-400"
					>
						Software Engineer.
					</span>
				</h1>

				<!-- Bio -->

				<p
					class="max-w-xl font-sans text-lg leading-relaxed font-medium text-stone-800 dark:text-stone-300"
				>
					British developer with a focus on design and performance. Specialising in

					<strong
						class="font-extrabold text-black underline decoration-(--color-accent-pop) decoration-4 underline-offset-4 dark:text-white"
						>Frontend Architecture</strong
					>,

					<strong class="font-extrabold text-black dark:text-white">Linux Systems</strong>, and

					<strong class="font-extrabold text-black dark:text-white">Embedded Development</strong>.
				</p>

				<!-- Buttons -->

				<div class="mt-10 flex flex-wrap gap-5">
					<a
						href={resolve('/contact')}
						class="inline-flex items-center justify-center border-2 border-black px-8 py-4 text-sm font-bold tracking-wider text-black uppercase transition-colors hover:bg-black hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black"
					>
						Contact
					</a>
				</div>
			</div>

			<!-- Visual Column -->

			<div class="relative hidden lg:col-span-5 lg:block">
				<div class="group relative mx-auto aspect-3/4 w-full max-w-sm">
					<!-- Glass Background/Frame -->
					<div
						class="absolute -inset-4 rounded-3xl border border-stone-200/50 bg-white/30 backdrop-blur-xl transition-all duration-500 group-hover:-inset-6 group-hover:bg-white/40 dark:border-stone-700/50 dark:bg-stone-900/30 dark:group-hover:bg-stone-900/40"
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
						<div class="absolute inset-0 bg-gradient-to-t from-stone-900/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Scroll Indicator -->
	<div
		class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-stone-400 dark:text-stone-600"
	>
		<ArrowDown size={24} weight="bold" />
	</div>
</section>
