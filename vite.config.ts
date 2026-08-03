import path from "node:path";
import adapter from "@sveltejs/adapter-static";
import { enhancedImages } from "@sveltejs/enhanced-img";
import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { mdsvex, type MdsvexOptions } from "mdsvex";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import remarkMath from "remark-math";
import { defineConfig } from "vite";
import { cspDirectives } from "./src/lib/csp.ts";
import { remarkEnhancedImages } from "./src/lib/markdown/remark-enhanced-images.ts";
import { remarkReadTime } from "./src/lib/markdown/remark-read-time.ts";
import { mdsvexHighlighter } from "./src/lib/markdown/shiki-highlighter.ts";

const mdsvexOptions: MdsvexOptions = {
	extensions: [".md"],
	highlight: {
		highlighter: mdsvexHighlighter,
	} as MdsvexOptions["highlight"],
	remarkPlugins: [
		remarkEnhancedImages,
		remarkReadTime,
		remarkMath,
	] as MdsvexOptions["remarkPlugins"],
	rehypePlugins: [
		rehypeSlug,
		[
			rehypeAutolinkHeadings,
			{
				behavior: "append",
				properties: {
					className: ["heading-anchor"],
					ariaHidden: true,
					tabIndex: -1,
				},
			},
		],
		rehypeKatex,
	] as unknown as MdsvexOptions["rehypePlugins"],
	layout: {
		_: path.resolve(
			import.meta.dirname,
			"./src/lib/components/markdown/MarkdownLayout.svelte",
		),
	},
	smartypants: true,
};

export default defineConfig({
	plugins: [
		tailwindcss(),
		enhancedImages(),
		sveltekit({
			extensions: [".svelte", ".md"],
			preprocess: [mdsvex(mdsvexOptions)],
			// Kit 3 takes these flat, not nested under `kit` — split_config sorts
			// unknown keys off to vite-plugin-svelte, which silently rejects them.
			adapter: adapter(),
			csp: { mode: "auto", directives: cspDirectives },
			files: { params: "src/params.ts" },
		}),
	],
	preview: {
		allowedHosts: ["oliverwalton.uk"],
	},
});
