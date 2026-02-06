<script>
	import { resolve } from '$app/paths';
	import ArrowRightIcon from 'phosphor-svelte/lib/ArrowRightIcon';
	import ArrowUpRightIcon from 'phosphor-svelte/lib/ArrowUpRightIcon';
	import { fly } from 'svelte/transition';
	import { onMount } from 'svelte';

	let ready = $state(false);

	onMount(() => {
		ready = true;
	});
</script>

<section class="border-t border-surface-200-800 bg-surface-50-950 px-6 py-32">
	<div class="relative z-10 container mx-auto max-w-7xl">
		<!-- Header: Consistent with previous sections -->
		<div class="mb-20 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
			<div>
				{#if ready}
					<h2
						in:fly={{ y: 20, duration: 600, delay: 0 }}
						class="font-heading text-5xl font-black tracking-tighter text-surface-950-50 md:text-6xl"
					>
						About Me.
					</h2>
				{/if}
			</div>
			<div class="hidden md:block">
				{#if ready}
					<p
						in:fly={{ y: 20, duration: 600, delay: 100 }}
						class="hidden max-w-xs text-right text-sm font-bold tracking-wide text-surface-600-400 md:block"
					>
						A brief introduction <br />to who I am and what I do.
					</p>
				{/if}
			</div>
		</div>

		<div class="grid gap-20 md:grid-cols-2">
			<!-- Left Column: About/Bio -->
			<div class="space-y-12">
				{#if ready}
					<div
						in:fly={{ y: 20, duration: 600, delay: 200 }}
						class="max-w-xl space-y-8 text-lg leading-relaxed font-medium text-surface-600-400"
					>
						<p>
							I'm a developer who likes building software that works well and looks good. I believe
							good engineering should always serve the people using it.
						</p>
						<p>
							When I'm not working, I'm usually with my family. I also follow Formula 1 closely and
							have a real interest in architecture—basically, I just enjoy seeing how complex things
							are put together, whether it's a race car or a building.
						</p>
					</div>
					<div in:fly={{ y: 20, duration: 600, delay: 300 }}>
						<a
							href={resolve('/about')}
							class="inline-flex items-center gap-3 border-b-2 border-surface-950-50 pb-1 text-lg font-bold text-surface-950-50 hover:border-surface-600-400 hover:text-surface-600-400"
						>
							Read full bio <ArrowRightIcon size={16} weight="bold" />
						</a>
					</div>
				{/if}
			</div>

			<!-- Right Column: Links & Footer Info -->
			<div class="flex flex-col justify-between space-y-16 md:items-end">
				<div class="space-y-8 md:text-right">
					{#if ready}
						<h3
							in:fly={{ y: 20, duration: 600, delay: 400 }}
							class="font-heading text-3xl font-bold tracking-tight text-surface-950-50"
						>
							Connect.
						</h3>
						<ul class="space-y-4 text-lg font-medium text-surface-600-400">
							<li in:fly={{ y: 10, duration: 600, delay: 450 }}>
								<a
									href="https://github.com/olivertgwalton"
									target="_blank"
									rel="noopener noreferrer"
									class="flex items-center gap-2 transition-colors hover:text-surface-950-50 md:justify-end"
								>
									Github <ArrowUpRightIcon size={16} class="opacity-50" />
								</a>
							</li>
							<li in:fly={{ y: 10, duration: 600, delay: 500 }}>
								<a
									href="https://www.linkedin.com/in/oliver-walton03/"
									target="_blank"
									rel="noopener noreferrer"
									class="flex items-center gap-2 transition-colors hover:text-surface-950-50 md:justify-end"
								>
									LinkedIn <ArrowUpRightIcon size={16} class="opacity-50" />
								</a>
							</li>
							<li in:fly={{ y: 10, duration: 600, delay: 550 }}>
								<a
									href="https://t.me/oliverwalton03"
									target="_blank"
									rel="noopener noreferrer"
									class="flex items-center gap-2 transition-colors hover:text-surface-950-50 md:justify-end"
								>
									Telegram <ArrowUpRightIcon size={16} class="opacity-50" />
								</a>
							</li>
							<li in:fly={{ y: 10, duration: 600, delay: 600 }}>
								<a
									href="https://instagram.com/olivertgwalton03"
									target="_blank"
									rel="noopener noreferrer"
									class="flex items-center gap-2 transition-colors hover:text-surface-950-50 md:justify-end"
								>
									Instagram <ArrowUpRightIcon size={16} class="opacity-50" />
								</a>
							</li>
						</ul>
					{/if}
				</div>

				{#if ready}
					<div
						class="flex flex-col gap-2 md:items-end"
						in:fly={{ y: 20, duration: 600, delay: 700 }}
					>
						<div class="font-heading text-2xl font-bold text-surface-950-50">Oliver.</div>
						<div class="text-sm font-medium text-surface-600-400">
							&copy; {new Date().getFullYear()} Oliver Walton. All rights reserved.
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
</section>
