<script lang="ts">
	interface Props {
		label: string;
		id: string;
		name?: string;
		value: string;
		type?: string;
		placeholder?: string;
		required?: boolean;
		[key: string]: unknown;
	}

	let {
		label,
		id,
		name,
		value = $bindable(),
		type = 'text',
		placeholder = '',
		required = false,
		...rest
	}: Props = $props();
</script>

<div class="flex flex-col gap-2">
	<label for={id} class="text-muted-foreground text-xs font-black tracking-widest uppercase">
		{label}
	</label>
	<input
		{type}
		name={name ?? id}
		{id}
		bind:value
		{placeholder}
		{required}
		autocomplete="off"
		class="border-border text-foreground placeholder-muted focus:border-primary border-b-2 bg-transparent py-2 font-heading text-xl font-bold focus:outline-none"
		{...rest}
	/>
</div>
