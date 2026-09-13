import type { Component } from "svelte";
import type { PageLoad } from "./$types";

// Per-post code-splitting: only the visited post's markdown component is imported.
// Runs in a universal load (not +page.server.ts) so the resolved Component can be
// used directly during SSR instead of needing to cross the server->client data boundary.
// The server load has already 404'd unknown slugs, so the module always exists.
const modules = import.meta.glob<{ default: Component }>([
	"/src/lib/blogs/**/index.md",
	"/src/lib/projects/**/index.md",
]);

export const load: PageLoad = async ({ data }) => {
	const module = await modules[`/src/lib/${data.type}/${data.slug}/index.md`]();
	return { ...data, Content: module.default };
};
