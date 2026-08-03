<script lang="ts" generics="T extends string">
import { ToggleGroup } from "@skeletonlabs/skeleton-svelte";

interface Tab {
	id: T;
	label: string;
}

let {
	tabs,
	active = $bindable(),
}: {
	tabs: Tab[];
	active: T;
} = $props();
</script>

<ToggleGroup
	value={[active]}
	deselectable={false}
	onValueChange={(details) => {
			const next = tabs.find((tab) => tab.id === details.value[0]);
			if (next) active = next.id;
		}}
	class="flex flex-wrap gap-2"
>
	{#each tabs as tab (tab.id)}
		<ToggleGroup.Item
			value={tab.id}
			class="rounded-full px-5 py-2.5 font-mono text-xs font-bold tracking-wider uppercase transition-all
					bg-surface-200-700 text-surface-600-400 hover:bg-surface-300-600 hover:text-surface-950-50
					data-[state=on]:preset-filled-brand"
		>
			{tab.label}
		</ToggleGroup.Item>
	{/each}
</ToggleGroup>
