import adapter from '@sveltejs/adapter-vercel';
import { mdsvex, escapeSvelte } from 'mdsvex';
import { createHighlighter } from 'shiki';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import path from 'node:path';
import { visit } from 'unist-util-visit';
import getReadingTime from 'reading-time';
import { toString } from 'mdast-util-to-string';

const highlighter = await createHighlighter({
	themes: ['github-light', 'github-dark'],
	langs: ['typescript', 'javascript', 'svelte', 'bash', 'css', 'html', 'json', 'markdown', 'python']
});

function remarkReadTime() {
	return function (tree, file) {
		const text = toString(tree);
		const readingTime = getReadingTime(text);
		file.data.fm = {
			...file.data.fm,
			readTime: Math.ceil(readingTime.minutes) + ' min read'
		};
	};
}

/**
 * Remark plugin to transform local images to use enhanced:img
 * @returns {import('unified').Transformer}
 */
function remarkEnhancedImages() {
	return (tree, file) => {
		const imports = [];
		let count = 0;

		const newTreeChildren = [];
		for (let i = 0; i < tree.children.length; i++) {
			const node = tree.children[i];

			if (node.type !== 'paragraph') {
				newTreeChildren.push(node);
				continue;
			}

			const children = node.children;
			let currentParagraphChildren = [];
			let currentGroup = [];

			const flushPara = () => {
				if (currentParagraphChildren.length > 0) {
					newTreeChildren.push({
						type: 'paragraph',
						children: currentParagraphChildren
					});
					currentParagraphChildren = [];
				}
			};

			const flushGroup = () => {
				if (currentGroup.length === 0) return;

				flushPara(); // Flush any text preceding the images

				const tags = currentGroup.map((img) => {
					const { url, alt } = img;
					let importName = `enhanced_image_${count++}`;
					let importPath = url;
					if (url.startsWith('/assets/')) {
						importPath = url.replace('/assets/', '$lib/assets/');
					} else if (url.startsWith('./') && file.filename) {
						importPath = path.resolve(path.dirname(file.filename), url);
					}
					imports.push(`import ${importName} from '${importPath}?enhanced';`);
					return `<MarkdownImage src={${importName}} alt="${alt || ''}" />`;
				});

				// If grouped (more than 1), use a grid.
				if (currentGroup.length > 1) {
					newTreeChildren.push({
						type: 'html',
						value: `<div class="grid grid-cols-2 gap-4 md:grid-cols-3 my-6 items-start">${tags.join('')}</div>`
					});
				} else {
					// Single image, just render it normally (full width)
					newTreeChildren.push({
						type: 'html',
						value: tags[0]
					});
				}

				currentGroup = [];
			};

			for (let j = 0; j < children.length; j++) {
				const child = children[j];
				// Check for image node
				if (child.type === 'image') {
					currentGroup.push(child);
				} else if (
					child.type === 'text' &&
					!child.value.trim() &&
					((j > 0 && children[j - 1].type === 'image') ||
						(j < children.length - 1 && children[j + 1].type === 'image'))
				) {
					// Ignore whitespace/newlines between images so they group together
				} else {
					// Text or other content breaks the group
					if (currentGroup.length > 0) {
						flushGroup();
					}
					currentParagraphChildren.push(child);
				}
			}
			flushGroup(); // Flush any remaining group at end of paragraph
			flushPara(); // Flush any remaining text
		}
		tree.children = newTreeChildren;

		if (imports.length > 0) {
			imports.unshift(`import MarkdownImage from '$lib/components/markdown/MarkdownImage.svelte';`);
			const importContent = imports.join('\n');
			let scriptNode = null;

			visit(tree, 'html', (node) => {
				if (node.value.trim().startsWith('<script') && !node.value.includes('context="module"')) {
					scriptNode = node;
					return false;
				}
			});

			if (scriptNode) {
				scriptNode.value = scriptNode.value.replace(/^<script.*?>/, `$& \n${importContent}`);
			} else {
				tree.children.unshift({
					type: 'html',
					value: `<script>\n${importContent}\n</script>`
				});
			}
		}
	};
}

import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// ... (existing code)

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
	extensions: ['.md'],
	highlight: {
		highlighter: async (code, lang = 'text') => {
			const html = highlighter.codeToHtml(code, {
				lang,
				themes: {
					light: 'github-light',
					dark: 'github-dark'
				},
				defaultColor: false
			});
			const withLang = html.replace('<pre ', `<pre data-language="${lang}" `);
			return `{@html \`${escapeSvelte(withLang)}\`}`;
		}
	},
	remarkPlugins: [remarkEnhancedImages, remarkReadTime, remarkMath],
	rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings, rehypeKatex],
	layout: {
		_: path.resolve(import.meta.dirname, './src/lib/components/markdown/MarkdownLayout.svelte')
	},
	smartypants: true
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md'],
	preprocess: [mdsvex(mdsvexOptions)],
	kit: {
		adapter: adapter(),
		csp: {
			mode: 'auto',
			directives: {
				'default-src': ['self'],
				'script-src': ['self', 'blob:', "'wasm-unsafe-eval'", 'https://va.vercel-scripts.com'],
				'worker-src': ['self', 'blob:'],
				'style-src': ['self', 'unsafe-inline'],
				'style-src-attr': ['self', 'unsafe-inline'],
				'img-src': ['self', 'data:', 'https://cdn.bsky.app', 'https://picsum.photos'],
				'font-src': ['self', 'data:', 'https://cdn.jsdelivr.net'],
				'connect-src': [
					'self',
					'https://cdn.jsdelivr.net',
					'https://va.vercel-scripts.com',
					'https://vitals.vercel-insights.com'
				].filter(Boolean),
				'object-src': ['none'],
				'base-uri': ['self']
			}
		}
	}
};

export default config;
