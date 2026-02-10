import adapter from '@sveltejs/adapter-vercel';
import { mdsvex, escapeSvelte } from 'mdsvex';
import { createHighlighter } from 'shiki';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import path from 'node:path';
import { visit } from 'unist-util-visit';

const highlighter = await createHighlighter({
	themes: ['github-light', 'github-dark'],
	langs: ['typescript', 'javascript', 'svelte', 'bash', 'css', 'html', 'json', 'markdown', 'python']
});

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

				flushPara(); // Text before images becomes its own paragraph

				if (currentGroup.length > 1) {
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
					newTreeChildren.push({
						type: 'html',
						value: `<div class="markdown-image-grid">${tags.join('')}</div>`
					});
				} else {
					const { url, alt } = currentGroup[0];
					let importName = `enhanced_image_${count++}`;
					let importPath = url;
					if (url.startsWith('/assets/')) {
						importPath = url.replace('/assets/', '$lib/assets/');
					} else if (url.startsWith('./') && file.filename) {
						importPath = path.resolve(path.dirname(file.filename), url);
					}
					imports.push(`import ${importName} from '${importPath}?enhanced';`);
					newTreeChildren.push({
						type: 'html',
						value: `<MarkdownImage src={${importName}} alt="${alt || ''}" />`
					});
				}
				currentGroup = [];
			};

			for (let j = 0; j < children.length; j++) {
				const child = children[j];
				if (child.type === 'image') {
					currentGroup.push(child);
				} else if (
					child.type === 'text' &&
					!child.value.trim() &&
					((j > 0 && children[j - 1].type === 'image') ||
						(j < children.length - 1 && children[j + 1].type === 'image'))
				) {
					// Ignore whitespace between images
				} else {
					if (currentGroup.length > 0) {
						flushGroup();
					}
					currentParagraphChildren.push(child);
				}
			}
			flushGroup();
			flushPara();
		}
		tree.children = newTreeChildren;

		if (imports.length > 0) {
			imports.unshift(`import MarkdownImage from '$lib/components/markdown/MarkdownImage.svelte';`);
			const importContent = imports.join('\n');
			let scriptNode = null;

			visit(tree, 'html', (node) => {
				if (node.value.trim().startsWith('<script') && !node.value.includes('context="module"')) {
					scriptNode = node;
					return false; // Stop visiting
				}
			});

			if (scriptNode) {
				// Inject imports after the opening <script> tag
				scriptNode.value = scriptNode.value.replace(/^<script.*?>/, `$& \n${importContent}`);
			} else {
				// Create new script node at the top
				tree.children.unshift({
					type: 'html',
					value: `<script>\n${importContent}\n</script>`
				});
			}
		}
	};
}

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
			return `{@html \`${escapeSvelte(html)}\`}`;
		}
	},
	remarkPlugins: [remarkEnhancedImages],
	rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
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
				'script-src': ['self', 'blob:', 'https://va.vercel-scripts.com'],
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
