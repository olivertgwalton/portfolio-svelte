<script lang="ts">
	import InteractiveGrid from '$lib/components/visuals/InteractiveGrid.svelte';
	import { reveal } from '$lib/actions';
	import ArrowUpRight from 'phosphor-svelte/lib/ArrowUpRight';
</script>

<svelte:head>
	<title>Contact | Oliver Walton</title>
	<meta name="description" content="Get in touch via email or social media." />
</svelte:head>

<section
	class="relative min-h-[30vh] w-full overflow-hidden border-b border-stone-200 dark:border-stone-800"
>
	<InteractiveGrid />

	<div
		class="relative z-10 container mx-auto flex h-full min-h-[30vh] flex-col justify-end px-6 pt-32 pb-12"
	>
		<h1
			class="max-w-4xl font-serif text-6xl font-black tracking-tight text-stone-900 md:text-8xl dark:text-stone-100"
		>
			Say Hello.
		</h1>
	</div>
</section>

<section class="container mx-auto px-6 py-24">
	<div class="space-y-16">
		<div
			class="max-w-3xl space-y-6 text-xl leading-relaxed text-stone-600 dark:text-stone-400"
			use:reveal={{ delay: 0 }}
		>
			<p>
				I’m always open to discussing new projects, technical challenges, or simply chatting about
				Formula 1 and systems architecture.
			</p>

			<p>The best way to reach me is via email or through any of my social profiles below.</p>
		</div>

		<div class="grid gap-12 md:grid-cols-2 lg:gap-24" use:reveal={{ delay: 200 }}>
			<!-- Email -->
			<div class="space-y-4">
				<h3 class="font-mono text-xs font-bold tracking-widest text-stone-400 uppercase">Direct</h3>
				<a
					href="mailto:hello@oliverwalton.dev"
					class="block font-serif text-2xl font-bold text-stone-900 transition-colors hover:text-stone-500 sm:text-3xl dark:text-stone-100"
				>
					olivertgwalton03@gmail.com
				</a>
			</div>

			<!-- Socials -->
			<div class="space-y-4 md:pl-12">
				<h3 class="font-mono text-xs font-bold tracking-widest text-stone-400 uppercase">
					Socials
				</h3>
				<ul class="space-y-4 font-serif text-2xl font-bold text-stone-900 dark:text-stone-100">
					<li>
						<a
							href="https://github.com/olivertgwalton"
							target="_blank"
							rel="noopener noreferrer"
							class="flex items-center gap-2 transition-colors hover:text-stone-500"
						>
							Github <ArrowUpRight size={20} weight="bold" class="text-stone-400" />
						</a>
					</li>
					<li>
						<a
							href="https://www.linkedin.com/in/oliver-walton03/"
							target="_blank"
							rel="noopener noreferrer"
							class="flex items-center gap-2 transition-colors hover:text-stone-500"
						>
							LinkedIn <ArrowUpRight size={20} weight="bold" class="text-stone-400" />
						</a>
					</li>
					<li>
						<a
							href="https://instagram.com/olivertgwalton03"
							target="_blank"
							rel="noopener noreferrer"
							class="flex items-center gap-2 transition-colors hover:text-stone-500"
						>
							Instagram <ArrowUpRight size={20} weight="bold" class="text-stone-400" />
						</a>
					</li>
				</ul>
			</div>
		</div>
	</div>
</section>
