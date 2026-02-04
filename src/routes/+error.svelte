<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
</script>

<div
	class="flex h-screen w-full flex-col items-center justify-center gap-4 bg-surface-50-950 text-center"
>
	<h1 class="font-heading text-9xl font-black text-surface-950-50">{page.status}</h1>
	<p class="text-xl font-bold text-surface-600-400">{page.error?.message ?? 'Unknown Error'}</p>
	<a href={resolve('/')} class="mt-4 btn preset-filled-primary-500">Go Home</a>
</div>
