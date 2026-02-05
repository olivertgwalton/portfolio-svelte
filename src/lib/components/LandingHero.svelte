<script lang="ts">
	import { resolve } from '$app/paths';
	import me from '$lib/assets/me.jpg?enhanced';
	import ArrowDownIcon from 'phosphor-svelte/lib/ArrowDownIcon';
	import InteractiveGrid from '$lib/components/visuals/InteractiveGrid.svelte';
	import { reveal } from '$lib/actions';
</script>

<section
	class="border-border dark:border-border relative flex min-h-[80vh] w-full items-center justify-center overflow-hidden border-b"
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
					class="mb-8 inline-flex items-center gap-2 rounded-full border border-surface-200-800 bg-surface-50-950/80 px-4 py-1.5 shadow-sm backdrop-blur-sm"
				>
					<span class="text-foreground text-xs font-bold tracking-widest">
						<span role="img" aria-label="United Kingdom">🇬🇧</span> Based in the UK
					</span>
				</div>

				<!-- Headline -->

				<h1
					use:reveal={{ delay: 100, y: 20 }}
					class="text-foreground mb-8 font-heading leading-[0.9] font-black tracking-tighter"
				>
					<span class="block text-5xl md:text-8xl"> Oliver Walton. </span>

					<span class="mt-2 block text-2xl font-bold text-surface-600-400 md:text-4xl">
						Software Engineer.
					</span>
				</h1>
				<!-- Bio -->

				<p
					use:reveal={{ delay: 200, y: 20 }}
					class="max-w-xl font-sans text-lg leading-relaxed font-medium text-surface-800-200"
				>
					British developer with a focus on design and performance. Specialising in

					<strong
						class="text-foreground font-extrabold underline decoration-primary-500 decoration-4 underline-offset-4"
						>Frontend Architecture</strong
					>,

					<strong class="text-foreground font-extrabold">Linux Systems</strong>, and

					<strong class="text-foreground font-extrabold">Embedded Development</strong>.
				</p>

				<!-- Buttons -->

				<div use:reveal={{ delay: 300, y: 20 }} class="mt-10 flex flex-wrap gap-5">
					<a
						href={resolve('/contact')}
						class="btn preset-filled-primary-500 px-8 py-4 text-sm font-bold tracking-wider uppercase"
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
						class="/30 absolute -inset-4 rounded-3xl border border-surface-200-800/50 bg-surface-50-950/30 backdrop-blur-xl transition-all duration-500 group-hover:-inset-6 group-hover:bg-surface-50-950/40"
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
							class="absolute inset-0 bg-linear-to-t from-surface-950/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
						></div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Scroll Indicator -->
	<div
		use:reveal={{ delay: 600, y: -10 }}
		class="text-muted-foreground absolute bottom-8 left-1/2 -translate-x-1/2"
	>
		<span class="block animate-bounce">
			<ArrowDownIcon size={24} weight="bold" />
		</span>
	</div>
</section>
