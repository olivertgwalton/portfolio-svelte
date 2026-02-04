<script lang="ts">
	interface Props {
		label: string;
		id: string;
		name?: string;
		value: string;
		rows?: number;
		placeholder?: string;
		required?: boolean;
		[key: string]: unknown;
	}

	let {
		label,
		id,
		name,
		value = $bindable(),
		rows = 3,
		placeholder = '',
		required = false,
		...rest
	}: Props = $props();
</script>

<div class="flex flex-col gap-2">
	<label for={id} class="text-xs font-black tracking-widest uppercase text-surface-600-400">
		{label}
	</label>
	<textarea
		name={name ?? id}
		{id}
		bind:value
		{rows}
		{placeholder}
		{required}
		class="w-full border-b-2 border-surface-200-800 bg-transparent py-2 text-lg text-surface-950-50 placeholder:text-surface-600-400 focus:border-primary-500 focus:outline-none"
		{...rest}
	></textarea>
</div>
