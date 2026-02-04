<script lang="ts">
	import { reveal } from '$lib/actions';
	import ArrowUpRight from 'phosphor-svelte/lib/ArrowUpRight';
	import InteractiveGrid from '$lib/components/visuals/InteractiveGrid.svelte';
</script>

<svelte:head>
	<title>Contact | Oliver Walton</title>
	<meta name="description" content="Get in touch via email or social media." />
</svelte:head>

<section
	class="relative min-h-[30vh] w-full overflow-hidden border-b border-border"
>
	<InteractiveGrid />
	<div
		class="relative z-10 container mx-auto flex h-full min-h-[30vh] flex-col justify-end px-6 pt-32 pb-12"
	>
		<h1
			use:reveal={{ delay: 0, y: 20 }}
			class="max-w-4xl font-heading text-6xl font-black tracking-tight text-primary"
		>
			Say Hello.
		</h1>
	</div>
</section>

<section class="container mx-auto px-6 py-24">
	<div class="space-y-16">
		<div
			class="max-w-3xl space-y-6 text-xl leading-relaxed text-secondary"
			use:reveal={{ delay: 100 }}
		>
			<p>
				I’m always open to discussing new projects, technical challenges, or simply chatting about
				Formula 1 and systems architecture.
			</p>

			<p>The best way to reach me is via email or through any of my social profiles below.</p>
		</div>

		<div class="grid gap-12 md:grid-cols-2 lg:gap-24">
			<!-- Email -->
			<div class="space-y-4" use:reveal={{ delay: 200, y: 20 }}>
				<h3 class="font-mono text-xs font-bold tracking-widest text-muted uppercase">Direct</h3>
				<a
					href="mailto:hello@oliverwalton.dev"
					class="block font-heading text-2xl font-bold text-primary"
				>
					olivertgwalton03@gmail.com
				</a>
			</div>

			<!-- Socials -->
			<div class="space-y-4 md:pl-12" use:reveal={{ delay: 300, y: 20 }}>
				<h3 class="font-mono text-xs font-bold tracking-widest text-muted uppercase">
					Socials
				</h3>
				<ul class="space-y-4 font-heading text-2xl font-bold text-primary">
					<li>
						<a
							href="https://github.com/olivertgwalton"
							target="_blank"
							rel="noopener noreferrer"
							class="flex items-center gap-2 transition-colors hover:text-muted"
						>
							Github <ArrowUpRight size={20} weight="bold" class="text-muted" />
						</a>
					</li>
					<li>
						<a
							href="https://www.linkedin.com/in/oliver-walton03/"
							target="_blank"
							rel="noopener noreferrer"
							class="flex items-center gap-2 transition-colors hover:text-muted"
						>
							LinkedIn <ArrowUpRight size={20} weight="bold" class="text-muted" />
						</a>
					</li>
					<li>
						<a
							href="https://instagram.com/olivertgwalton03"
							target="_blank"
							rel="noopener noreferrer"
							class="flex items-center gap-2 transition-colors hover:text-muted"
						>
							Instagram <ArrowUpRight size={20} weight="bold" class="text-muted" />
						</a>
					</li>
				</ul>
			</div>
		</div>
	</div>
</section>
