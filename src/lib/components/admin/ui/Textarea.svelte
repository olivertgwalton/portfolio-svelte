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
	<label for={id} class="text-muted-foreground text-xs font-black tracking-widest uppercase">
		{label}
	</label>
	<textarea
		name={name ?? id}
		{id}
		bind:value
		{rows}
		{placeholder}
		{required}
		class="border-border text-foreground placeholder-muted focus:border-primary border-b-2 bg-transparent py-2 text-lg focus:outline-none"
		{...rest}
	></textarea>
</div>
