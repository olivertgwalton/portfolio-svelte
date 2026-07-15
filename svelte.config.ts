import path from 'node:path';
import type { Config } from '@sveltejs/kit';
import { mdsvex, type MdsvexOptions } from 'mdsvex';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import remarkMath from 'remark-math';
import adapter from 'svelte-adapter-bun';
import { cspDirectives } from './src/lib/csp.ts';
import { remarkEnhancedImages } from './src/lib/markdown/remark-enhanced-images.ts';
import { remarkReadTime } from './src/lib/markdown/remark-read-time.ts';
import { createMdsvexHighlighter } from './src/lib/markdown/shiki-highlighter.ts';

const mdsvexOptions: MdsvexOptions = {
	extensions: ['.md'],
	highlight: { highlighter: await createMdsvexHighlighter() } as MdsvexOptions['highlight'],
	remarkPlugins: [
		remarkEnhancedImages,
		remarkReadTime,
		remarkMath
	] as MdsvexOptions['remarkPlugins'],
	rehypePlugins: [
		rehypeSlug,
		[
			rehypeAutolinkHeadings,
			{
				behavior: 'append',
				properties: { className: ['heading-anchor'], ariaHidden: true, tabIndex: -1 }
			}
		],
		rehypeKatex
	] as unknown as MdsvexOptions['rehypePlugins'],
	layout: {
		_: path.resolve(import.meta.dirname, './src/lib/components/markdown/MarkdownLayout.svelte')
	},
	smartypants: true
};

const config: Config = {
	extensions: ['.svelte', '.md'],
	preprocess: [mdsvex(mdsvexOptions)],
	kit: {
		adapter: adapter(),
		csp: { mode: 'auto', directives: cspDirectives }
	}
};

export default config;
