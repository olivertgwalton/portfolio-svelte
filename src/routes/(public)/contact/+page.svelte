<script lang="ts">
	import PageHero from '$lib/components/PageHero.svelte';
	import { fly } from 'svelte/transition';
	import SocialLinks from '$lib/components/SocialLinks.svelte';
</script>

<svelte:head>
	<title>Contact | Oliver Walton</title>
	<meta name="description" content="Get in touch via email or social media.">
</svelte:head>

<PageHero title="Say Hello.">
	{#snippet subtitle()}
		Open for new projects, <br>and technical discussions.
	{/snippet}
</PageHero>

<section class="min-h-screen bg-surface-50-950 py-24">
	<div class="container mx-auto max-w-7xl px-6">
		<div class="space-y-16">
				<div
					class="max-w-3xl space-y-6 text-lg leading-relaxed text-surface-800-200"
					in:fly={{ y: 20, duration: 600, delay: 200 }}
				>
					<p>
						I'm always open to discussing new projects, technical challenges, or simply chatting
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
						<SocialLinks size="lg" />
					</div>
				</div>
		</div>
	</div>
</section>
