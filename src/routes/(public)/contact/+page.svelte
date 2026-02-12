<script lang="ts">
	import ArrowUpRightIcon from 'phosphor-svelte/lib/ArrowUpRightIcon';
	import InteractiveGrid from '$lib/components/visuals/InteractiveGrid.svelte';
	import { fly } from 'svelte/transition';
	import { onMount } from 'svelte';

	let ready = $state(false);

	onMount(() => {
		ready = true;
	});
</script>

<svelte:head>
	<title>Contact | Oliver Walton</title>
	<meta name="description" content="Get in touch via email or social media.">
</svelte:head>

<section class="relative min-h-[30vh] w-full overflow-hidden border-b border-surface-200-800/80">
	<InteractiveGrid />
	<div
		class="relative z-10 container mx-auto flex h-full min-h-[30vh] max-w-7xl flex-col justify-end px-6 pt-32 pb-12"
	>
		<div class="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
			<div>
				<h1
					class="font-heading text-5xl font-black tracking-tighter text-surface-950-50 md:text-8xl"
				>
					Say Hello.
				</h1>
			</div>
			<p
				class="hidden max-w-xs text-right font-mono text-sm tracking-wide text-surface-800-200 md:block"
			>
				Open for new projects, <br>and technical discussions.
			</p>
		</div>
	</div>
</section>

<section class="min-h-screen bg-surface-50-950 py-24">
	<div class="container mx-auto max-w-7xl px-6">
		<div class="space-y-16">
			{#if ready}
				<div
					class="max-w-3xl space-y-6 text-lg leading-relaxed text-surface-800-200"
					in:fly={{ y: 20, duration: 600, delay: 200 }}
				>
					<p>
						I’m always open to discussing new projects, technical challenges, or simply chatting
						about Formula 1 and systems architecture.
					</p>

					<p>The best way to reach me is via email or through any of my social profiles below.</p>
				</div>

				<div class="grid gap-12 md:grid-cols-2 lg:gap-24">
					<!-- Email -->
					<div class="space-y-4" in:fly={{ y: 20, duration: 600, delay: 300 }}>
						<h2 class="font-mono text-xs font-bold tracking-widest text-surface-500 uppercase">
							Direct
						</h2>
						<a
							href="mailto:olivertgwalton03@gmail.com"
							class="block font-heading text-2xl font-bold text-surface-950-50"
						>
							olivertgwalton03@gmail.com
						</a>
					</div>

					<!-- Socials -->
					<div class="space-y-4 md:pl-12" in:fly={{ y: 20, duration: 600, delay: 400 }}>
						<h2 class="font-mono text-xs font-bold tracking-widest text-surface-800-200 uppercase">
							Socials
						</h2>
						<ul class="space-y-4 font-heading text-2xl font-bold text-surface-950-50">
							<li>
								<a
									href="https://github.com/olivertgwalton"
									target="_blank"
									title="Github (opens in new window)"
									rel="noopener noreferrer"
									class="flex items-center gap-2 transition-colors hover:text-surface-600-400"
								>
									Github <span aria-hidden="true"><ArrowUpRightIcon size={20} weight="bold" class="text-surface-500" /></span>
								</a>
							</li>
							<li>
								<a
									href="https://www.linkedin.com/in/oliver-walton03/"
									target="_blank"
									title="LinkedIn (opens in new window)"
									rel="noopener noreferrer"
									class="flex items-center gap-2 transition-colors hover:text-surface-600-400"
								>
									LinkedIn <span aria-hidden="true"><ArrowUpRightIcon size={20} weight="bold" class="text-surface-50" /></span>
								</a>
							</li>
							<li>
								<a
									href="https://t.me/oliverwalton03"
									target="_blank"
									title="Telegram (opens in new window)"
									rel="noopener noreferrer"
									class="flex items-center gap-2 transition-colors hover:text-surface-600-400"
								>
									Telegram <span aria-hidden="true"><ArrowUpRightIcon size={20} weight="bold" class="text-surface-500" /></span>
								</a>
							</li>
							<li>
								<a
									href="https://instagram.com/olivertgwalton03"
									target="_blank"
									title="Instagram (opens in new window)"
									rel="noopener noreferrer"
									class="flex items-center gap-2 transition-colors hover:text-surface-600-400"
								>
									Instagram <span aria-hidden="true"><ArrowUpRightIcon size={20} weight="bold" class="text-surface-500" /></span>
								</a>
							</li>
						</ul>
					</div>
				</div>
			{/if}
		</div>
	</div>
</section>
