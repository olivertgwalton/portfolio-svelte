<script lang="ts">
	import { reveal } from '$lib/actions';
	import InteractiveGrid from '$lib/components/visuals/InteractiveGrid.svelte';
</script>

<svelte:head>
	<title>About | Oliver Walton</title>
	<meta
		name="description"
		content="22 years old. Breaking Linux installs since age 10. Now addicted to homelabbing and embedded systems."
	/>
</svelte:head>

<section class="border-border relative min-h-[30vh] w-full overflow-hidden border-b">
	<InteractiveGrid />
	<div
		class="relative z-10 container mx-auto flex h-full min-h-[30vh] flex-col justify-end px-6 pt-32 pb-12"
	>
		<h1
			use:reveal={{ delay: 0, y: 20 }}
			class="text-foreground max-w-4xl font-heading text-6xl font-black tracking-tight"
		>
			Background.
		</h1>
	</div>
</section>

<section class="container mx-auto px-6 py-24">
	<div class="grid gap-16 lg:grid-cols-[1fr_1fr] lg:gap-32">
		<!-- Left Column: The Narrative -->
		<div class="text-muted-foreground space-y-12 text-lg leading-relaxed">
			<div use:reveal={{ delay: 0 }}>
				<h2 class="text-foreground mb-6 font-heading text-3xl font-bold">Systematic Curiosity</h2>
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

			<div use:reveal={{ delay: 200 }}>
				<h2 class="text-foreground mb-6 font-heading text-3xl font-bold">Beyond the Code</h2>
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
		<div class="space-y-16" use:reveal={{ delay: 400 }}>
			<div class="border-border border-t pt-8">
				<div
					class="text-muted-foreground mb-2 font-mono text-xs font-bold tracking-widest uppercase"
				>
					Location
				</div>
				<div class="text-foreground font-heading text-4xl font-bold">Soihull, United Kingdom</div>
			</div>

			<div class="border-border border-t pt-8">
				<div
					class="text-muted-foreground mb-2 font-mono text-xs font-bold tracking-widest uppercase"
				>
					Focus
				</div>
				<div class="text-foreground font-heading text-4xl font-bold">Systems & Frontend</div>
			</div>

			<div class="border-border border-t pt-8">
				<div
					class="text-muted-foreground mb-2 font-mono text-xs font-bold tracking-widest uppercase"
				>
					Experience
				</div>
				<div class="text-foreground font-heading text-4xl font-bold">22 Years Old</div>
			</div>
		</div>
	</div>
</section>
