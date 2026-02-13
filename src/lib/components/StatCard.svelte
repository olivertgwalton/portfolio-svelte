<script lang="ts">
	let { label, value }: { label: string; value: string } = $props();
</script>

<div class="border-t border-surface-200-800 pt-8">
	<div class="mb-2 font-mono text-xs font-bold tracking-widest text-surface-800-200 uppercase">
		{label}
	</div>
	<div class="font-heading text-4xl font-bold text-surface-950-50">
		{value}
	</div>
</div>
