<script lang="ts">
	import PageHero from '$lib/components/PageHero.svelte';
	import StatCard from '$lib/components/StatCard.svelte';
	import { fly } from 'svelte/transition';
</script>

<svelte:head>
	<title>About | Oliver Walton</title>
	<meta
		name="description"
		content="22 years old. Breaking Linux installs since age 10. Now addicted to homelabbing and embedded systems."
	>
</svelte:head>

<PageHero title="Background.">
	{#snippet subtitle()}
		Breaking Linux installs <br>since age 10.
	{/snippet}
</PageHero>

<section class="bg-surface-50-950 py-24">
		<div class="container mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-[1fr_1fr] lg:gap-32">
			<!-- Left Column: The Narrative -->
			<div class="space-y-12 text-lg leading-relaxed text-surface-800-200">
				<div in:fly={{ y: 20, duration: 600, delay: 200 }}>
					<h2 class="mb-6 font-heading text-3xl font-bold text-surface-950-50">
						Systematic Curiosity
					</h2>
					<p>
						My interest in technology started early, with an incredibly fast Intel® i3 4150 and HDD.
						I quickly discovered Linux, and delved into the world of operating systems. Since age
						10, I’ve been using Linux as my daily driver - it wasn't always smooth sailing, but
						troubleshooting display drivers and configuring window managers taught me resilience and
						a deep appreciation for how software interacts with hardware.
					</p>
					<p class="mt-4">
						That foundation naturally evolved into a career in software engineering (with a side
						hustle of embedded systems). I don't just write code; I try to understand the entire
						stack, from the kernel up to the pixel on the screen.
					</p>
				</div>

				<div in:fly={{ y: 20, duration: 600, delay: 300 }}>
					<h2 class="mb-6 font-heading text-3xl font-bold text-surface-950-50">Beyond the Code</h2>
					<p>
						I’m driven by an appreciation for complex systems, whether they are digital or physical.
						I follow Formula 1 for the relentless engineering optimisation, and I love architecture
						for the marriage of structure and aesthetics.
					</p>
					<p class="mt-4">
						At home, you'll find me tinkering with my homelab—optimising my local network and
						self-hosting services, or working on electronics projects. It's a way to keep learning
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
				<StatCard label="Location" value="Solihull, United Kingdom" />
				<StatCard label="Focus" value="Systems & Frontend" />
				<StatCard label="Age" value="22 Years Old" />
			</div>
		</div>
</section>
