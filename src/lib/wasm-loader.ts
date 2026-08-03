import type * as WasmGrid from "./wasm/rust_grid.js";

export interface LoadedWasm {
	glue: typeof WasmGrid;
	memory: WebAssembly.Memory;
}

// Both canvas visuals need the same module instance and the same view over its
// linear memory, so the glue is loaded once and the result memoised. The .wasm
// itself is served from static/ rather than bundled (see the build:wasm script).
let loaded: Promise<LoadedWasm | null> | null = null;

export function loadWasm(): Promise<LoadedWasm | null> {
	loaded ??= import("./wasm/rust_grid.js")
		.then(async (glue) => ({
			glue,
			memory: (
				await glue.default({
					module_or_path: "/wasm/rust_grid_bg.wasm",
				})
			).memory,
		}))
		.catch(() => {
			// Don't cache the failure: callers re-init on resize, and a transient
			// fetch error shouldn't disable the visual for the rest of the session.
			loaded = null;
			return null;
		});

	return loaded;
}
