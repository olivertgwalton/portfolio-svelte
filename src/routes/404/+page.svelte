<script lang="ts">
import { resolve } from "$app/paths";
import MetaTags from "#lib/components/MetaTags.svelte";
</script>

<!--
	A real prerendered route rather than a hand-written static/404.html, so the
	page inherits the app shell and theme CSS and picks up the visitor's chosen
	theme on hydration like every other page. nginx serves the prerendered
	404.html via `error_page`, so the status code is still a real 404.

	Deliberately not adapter-static's `fallback` option: that would render
	+error.svelte here but also disables the adapter's strict check that every
	route is prerendered.
-->
<MetaTags title="Page not found" description="That page doesn't exist." />

<div
	class="flex min-h-[70vh] w-full flex-col items-center justify-center gap-4 bg-surface-50-950 px-6 text-center"
>
	<h1 class="font-heading text-9xl font-black text-surface-950-50">404</h1>
	<p class="text-xl font-bold text-surface-600-400">That page doesn't exist.</p>
	<a href={resolve('/')} class="mt-4 btn preset-filled-primary-500">Go Home</a>
</div>
