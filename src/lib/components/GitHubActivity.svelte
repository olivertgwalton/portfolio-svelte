<script lang="ts">
	import { reveal } from '$lib/actions';
	import SectionHeader from '$lib/components/SectionHeader.svelte';
	import type { GitHubData } from '$lib/github';
	import { formatDate } from '$lib/utils';

	const LEVELS = [0, 1, 2, 3, 4] as const;
	const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''] as const;

	let { github }: { github: GitHubData } = $props();

	const weeks = $derived(github.contributionGraph);

	const stats = $derived([
		{ label: 'Repositories', value: github.stats.repos },
		{ label: 'Commits', value: github.stats.commits },
		{ label: 'Pull Requests', value: github.stats.pullRequests },
		{ label: 'Stars', value: github.stats.stars },
		{ label: 'Issues', value: github.stats.issues },
		{ label: 'Followers', value: github.stats.followers }
	]);

	const monthLabels = $derived.by(() => {
		const months: { label: string; col: number }[] = [];
		let prev = -1;
		for (let w = 0; w < weeks.length; w++) {
			const d = weeks[w].days[0];
			if (!d) continue;
			const m = new Date(d.date).getMonth();
			if (m !== prev) {
				months.push({
					label: new Date(d.date).toLocaleString('en-GB', { month: 'short' }),
					col: w
				});
				prev = m;
			}
		}
		return months;
	});

	function fmt(n: number): string {
		return n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k` : n.toString();
	}

	// Tooltip
	let wrapper: HTMLElement | undefined = $state();
	let tip = $state<{ x: number; y: number; date: string; count: number } | null>(null);

	function onCell(e: MouseEvent | FocusEvent, date: string, count: number) {
		if (!wrapper) return;
		const cell = (e.currentTarget as HTMLElement).getBoundingClientRect();
		const box = wrapper.getBoundingClientRect();
		tip = {
			x: cell.left - box.left + cell.width / 2,
			y: cell.top - box.top,
			date,
			count
		};
	}
</script>

<section class="border-t border-surface-200-800/80 bg-surface-50-950 py-24 md:py-32">
	<div class="container mx-auto max-w-7xl px-6">
		<SectionHeader title="Open Source." class="mb-16 md:mb-20">
			{#snippet subtitle()}
				Contributions and activity <br />on GitHub.
			{/snippet}
		</SectionHeader>

		<!-- Stats -->
		<div
			use:reveal={{ delay: 100 }}
			class="mb-16 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-6 md:gap-8"
		>
			{#each stats as stat, i (stat.label)}
				<div use:reveal={{ delay: 150 + i * 50 }} class="border-t border-surface-200-800 pt-6">
					<div class="mb-2 font-mono text-[10px] font-bold tracking-widest text-surface-600-400 uppercase">
						{stat.label}
					</div>
					<div class="font-heading text-3xl font-black text-surface-950-50 md:text-4xl">
						{fmt(stat.value)}
					</div>
				</div>
			{/each}
		</div>

		<!-- Graph -->
		<div use:reveal={{ delay: 400 }} class="relative" bind:this={wrapper}>
			<div class="rounded-2xl border border-surface-200-800 bg-surface-100-800 p-4 md:p-6">
				<p class="mb-4 font-heading text-sm font-bold text-surface-950-50">
					{github.stats.contributions} contributions in the last year
				</p>

				<div class="overflow-x-auto overflow-y-hidden">
					<div class="graph" style="--cols: {weeks.length};">
						{#each monthLabels as m (m.col)}
							<span class="month" style="grid-column: {m.col + 2};">
								{m.label}
							</span>
						{/each}

						{#each DAY_LABELS as label, i (i)}
							<span class="day" style="grid-row: {i + 2};">{label}</span>
						{/each}

						{#each weeks as week, wi (wi)}
							{#each week.days as day, di (day.date)}
								<button
									type="button"
									class="cell l{day.level}"
									style="grid-row: {di + 2}; grid-column: {wi + 2};"
									onmouseenter={(e) => onCell(e, day.date, day.count)}
									onmouseleave={() => (tip = null)}
									onfocus={(e) => onCell(e, day.date, day.count)}
									onblur={() => (tip = null)}
									aria-label="{day.count} contributions on {day.date}"
								></button>
							{/each}
						{/each}

						<!-- Legend in last grid row, spanning all week columns, right-aligned -->
						<div class="legend" style="grid-column: 2 / -1; grid-row: 10;">
							<span class="label">Less</span>
							{#each LEVELS as l (l)}
								<span class="key l{l}"></span>
							{/each}
							<span class="label">More</span>
						</div>
					</div>
				</div>
			</div>

			{#if tip}
				<div
					class="pointer-events-none absolute z-50 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-lg border border-surface-200-800 bg-surface-950 px-3 py-2 text-xs text-surface-50 shadow-xl"
					style="left: {tip.x}px; top: {tip.y - 8}px;"
				>
					<strong>{tip.count} contribution{tip.count !== 1 ? 's' : ''}</strong>
					<span class="text-surface-400">on {formatDate(tip.date)}</span>
				</div>
			{/if}
		</div>

		<p use:reveal={{ delay: 500 }} class="mt-6 text-right font-mono text-[10px] font-bold tracking-wide text-surface-500 uppercase">
			Updated {formatDate(github.updatedAt)}
		</p>
	</div>
</section>

<style>
	.graph {
		display: grid;
		grid-template-rows: auto repeat(7, 1fr) 6px auto;
		grid-template-columns: 30px repeat(var(--cols), 1fr);
		gap: 3px;
	}

	.month {
		grid-row: 1;
		display: flex;
		align-items: end;
		padding-bottom: 2px;
		font-family: var(--font-mono);
		font-size: 10px;
		font-weight: 700;
		text-transform: uppercase;
		color: var(--color-surface-500);
	}

	.day {
		grid-column: 1;
		display: flex;
		align-items: center;
		justify-content: end;
		padding-right: 4px;
		font-family: var(--font-mono);
		font-size: 10px;
		font-weight: 700;
		color: var(--color-surface-500);
	}

	.cell {
		aspect-ratio: 1;
		width: 100%;
		max-width: 16px;
		border-radius: 3px;
		border: none;
		padding: 0;
		cursor: pointer;
		transition: outline 0.1s;
	}

	.cell:hover {
		outline: 2px solid var(--color-primary-500);
		outline-offset: 1px;
	}

	.legend {
		display: flex;
		align-items: center;
		justify-content: end;
		gap: 4px;
	}

	.label {
		font-family: var(--font-mono);
		font-size: 10px;
		font-weight: 700;
		color: var(--color-surface-500);
	}

	.key {
		width: 12px;
		height: 12px;
		border-radius: 3px;
	}

	/* Levels */
	.l0 { background: light-dark(var(--color-surface-200), var(--color-surface-800)); }
	.l1 { background: light-dark(
		color-mix(in srgb, var(--color-primary-500) 30%, var(--color-surface-200)),
		color-mix(in srgb, var(--color-primary-500) 25%, var(--color-surface-800))
	); }
	.l2 { background: light-dark(
		color-mix(in srgb, var(--color-primary-500) 55%, var(--color-surface-200)),
		color-mix(in srgb, var(--color-primary-500) 50%, var(--color-surface-800))
	); }
	.l3 { background: light-dark(
		color-mix(in srgb, var(--color-primary-500) 80%, var(--color-surface-200)),
		color-mix(in srgb, var(--color-primary-500) 75%, var(--color-surface-800))
	); }
	.l4 { background: var(--color-primary-500); }
</style>
