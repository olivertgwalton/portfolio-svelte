<script lang="ts">
	import InteractiveGrid from '$lib/components/visuals/InteractiveGrid.svelte';
	import { fly } from 'svelte/transition';
	import { onMount } from 'svelte';

	let ready = $state(false);

	onMount(() => {
		ready = true;
	});
</script>

<svelte:head>
	<title>About | Oliver Walton</title>
	<meta
		name="description"
		content="22 years old. Breaking Linux installs since age 10. Now addicted to homelabbing and embedded systems."
	/>
</svelte:head>

<section class="relative min-h-[30vh] w-full overflow-hidden border-b border-surface-200-800">
	<InteractiveGrid />
	<div
		class="relative z-10 container mx-auto flex h-full min-h-[30vh] flex-col justify-end px-6 pt-32 pb-12"
	>
		<div class="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
			<div>
				{#if ready}
					<h1
						in:fly={{ y: 20, duration: 600, delay: 0 }}
						class="font-heading text-6xl font-black tracking-tighter text-surface-950-50 sm:text-7xl md:text-8xl"
					>
						Background.
					</h1>
				{/if}
			</div>
			{#if ready}
				<p
					in:fly={{ y: 20, duration: 600, delay: 100 }}
					class="hidden max-w-xs text-right font-mono text-sm tracking-wide text-surface-600-400 md:block"
				>
					Breaking Linux installs <br />since age 10.
				</p>
			{/if}
		</div>
	</div>
</section>

<section class="min-h-screen bg-surface-50-950 px-6 py-24">
	{#if ready}
		<div class="container mx-auto grid gap-16 lg:grid-cols-[1fr_1fr] lg:gap-32">
			<!-- Left Column: The Narrative -->
			<div class="space-y-12 text-lg leading-relaxed text-surface-600-400">
				<div in:fly={{ y: 20, duration: 600, delay: 200 }}>
					<h2 class="mb-6 font-heading text-3xl font-bold text-surface-950-50">
						Systematic Curiosity
					</h2>
					<p>
						My interest in technology started early, not with games, but with operating systems. Since
						age 10, I’ve been using Linux as my daily driver. It wasn't always smooth sailing, but
						troubleshooting display drivers and configuring window managers taught me resilience and a
						deep appreciation for how software interacts with hardware.
					</p>
					<p class="mt-4">
						That foundation naturally evolved into a career in software engineering. I don't just
						write code; I try to understand the entire stack, from the kernel up to the pixel on the
						screen.
					</p>
				</div>

				<div in:fly={{ y: 20, duration: 600, delay: 300 }}>
					<h2 class="mb-6 font-heading text-3xl font-bold text-surface-950-50">Beyond the Code</h2>
					<p>
						I’m driven by an appreciation for complex systems, whether they are digital or physical. I
						follow Formula 1 for the relentless engineering optimization, and I love architecture for
						the marriage of structure and aesthetics.
					</p>
					<p class="mt-4">
						At home, you'll find me tinkering with my homelab—optimizing my local network and
						self-hosting services—or working on electronics projects. It's a way to keep learning
						without the pressure of a deadline.
					</p>
					<p class="mt-4">
						Above all, I value my time with family. They keep me grounded and remind me that
						technology is ultimately a tool to improve our lives, not consume them.
					</p>
				</div>
			</div>

			<!-- Right Column: Stats / Highlights -->
			<div class="space-y-16" in:fly={{ y: 20, duration: 600, delay: 400 }}>
				<div class="border-t border-surface-200-800 pt-8">
					<div
						class="mb-2 font-mono text-xs font-bold tracking-widest text-surface-500 uppercase"
					>
						Location
					</div>
					<div class="font-heading text-4xl font-bold text-surface-950-50">
						Soihull, United Kingdom
					</div>
				</div>

				<div class="border-t border-surface-200-800 pt-8">
					<div
						class="mb-2 font-mono text-xs font-bold tracking-widest text-surface-500 uppercase"
					>
						Focus
					</div>
					<div class="font-heading text-4xl font-bold text-surface-950-50">Systems & Frontend</div>
				</div>

				<div class="border-t border-surface-200-800 pt-8">
					<div
						class="mb-2 font-mono text-xs font-bold tracking-widest text-surface-500 uppercase"
					>
						Experience
					</div>
					<div class="font-heading text-4xl font-bold text-surface-950-50">22 Years Old</div>
				</div>
			</div>
		</div>
	{/if}
</section>
