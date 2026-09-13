import type { Config } from "@sveltejs/kit/vite";

// worker-src and style-src-attr fall back to script-src and style-src.
export const cspDirectives: NonNullable<Config["csp"]>["directives"] = {
	"default-src": ["self"],
	"script-src": [
		"self",
		"blob:",
		"wasm-unsafe-eval",
		"https://static.cloudflareinsights.com",
	],
	"style-src": ["self", "unsafe-inline"],
	"img-src": ["self", "data:"],
	"font-src": ["self", "data:"],
	"connect-src": ["self", "https://cloudflareinsights.com"],
	"object-src": ["none"],
	"base-uri": ["self"],
};
