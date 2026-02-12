<script lang="ts">
	import InteractiveGrid from '$lib/components/visuals/InteractiveGrid.svelte';
	import { fly } from 'svelte/transition';
</script>

<svelte:head>
	<title>About | Oliver Walton</title>
	<meta
		name="description"
		content="22 years old. Breaking Linux installs since age 10. Now addicted to homelabbing and embedded systems."
	>
</svelte:head>

<section class="relative min-h-[30vh] w-full overflow-hidden border-b border-surface-200-800/80">
	<InteractiveGrid />
	<div
		class="relative z-10 container mx-auto flex h-full min-h-[30vh] max-w-7xl flex-col justify-end px-6 pt-32 pb-12"
	>
		<div class="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end lg:gap-32">
			<div>
				<h1
					class="font-heading text-5xl font-black tracking-tighter text-surface-950-50 md:text-8xl"
				>
					Background.
				</h1>
			</div>
			<div class="hidden lg:block">
				<p
					class="max-w-xs text-right font-mono text-sm tracking-wide text-surface-800-200 lg:ml-auto"
				>
					Breaking Linux installs <br>since age 10.
				</p>
			</div>
		</div>
	</div>
</section>

<section class="min-h-screen bg-surface-50-950 py-24">
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
				<div class="border-t border-surface-200-800 pt-8">
					<div
						class="mb-2 font-mono text-xs font-bold tracking-widest text-surface-800-200 uppercase"
					>
						Location
					</div>
					<div class="font-heading text-4xl font-bold text-surface-950-50">
						Soihull, United Kingdom
					</div>
				</div>

				<div class="border-t border-surface-200-800 pt-8">
					<div
						class="mb-2 font-mono text-xs font-bold tracking-widest text-surface-800-200 uppercase"
					>
						Focus
					</div>
					<div class="font-heading text-4xl font-bold text-surface-950-50">Systems & Frontend</div>
				</div>

				<div class="border-t border-surface-200-800 pt-8">
					<div
						class="mb-2 font-mono text-xs font-bold tracking-widest text-surface-800-200 uppercase"
					>
						Age
					</div>
					<div class="font-heading text-4xl font-bold text-surface-950-50">22 Years Old</div>
				</div>
			</div>
		</div>
</section>
