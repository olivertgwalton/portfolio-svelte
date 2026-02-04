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
	<label for={id} class="text-xs font-black tracking-widest text-secondary uppercase">
		{label}
	</label>
	<textarea
		name={name ?? id}
		{id}
		bind:value
		{rows}
		{placeholder}
		{required}
		class="border-b-2 border-border bg-transparent py-2 text-lg text-primary placeholder-muted focus:border-primary focus:outline-none"
		{...rest}
	></textarea>
</div>
