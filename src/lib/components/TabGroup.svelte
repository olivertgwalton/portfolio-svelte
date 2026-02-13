<script lang="ts" generics="T extends string">
	interface Tab {
		id: T;
		label: string;
	}

	let {
		tabs,
		active = $bindable()
	}: {
		tabs: Tab[];
		active: T;
	} = $props();
</script>

<div class="flex flex-wrap gap-2">
	{#each tabs as tab (tab.id)}
		<button
			onclick={() => (active = tab.id)}
			class="rounded-full px-5 py-2.5 font-mono text-xs font-bold tracking-wider uppercase transition-all
				{active === tab.id
				? 'bg-primary-500 text-white'
				: 'bg-surface-200-700 hover:bg-surface-300-600 text-surface-600-400 hover:text-surface-950-50'}"
		>
			{tab.label}
		</button>
	{/each}
</div>
