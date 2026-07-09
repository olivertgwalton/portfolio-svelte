import type { Component } from 'svelte';
import type { PageLoad } from './$types';

// Per-post code-splitting: only the visited post's markdown component is imported.
// Runs in a universal load (not +page.server.ts) so the resolved Component can be
// used directly during SSR instead of needing to cross the server->client data boundary.
const postModules = import.meta.glob('/src/lib/posts/**/index.md');
const projectModules = import.meta.glob('/src/lib/projects/**/index.md');

export const load: PageLoad = async ({ data }) => {
	const modules = data.type === 'posts' ? postModules : projectModules;
	const path = `/src/lib/${data.type}/${data.slug}/index.md`;

	const loader = modules[path] as (() => Promise<unknown>) | undefined;
	const module = (await loader?.()) as { default: Component } | undefined;

	return {
		...data,
		Content: module?.default ?? null
	};
};
