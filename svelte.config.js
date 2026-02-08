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

		visit(tree, 'image', (node) => {
			const { url, alt } = node;

			// Handle absolute /assets/ paths
			if (url.startsWith('/assets/')) {
				const importName = `enhanced_image_${count++}`;
				// Resolve /assets/ to $lib/assets/
				const resolvedPath = url.replace('/assets/', '$lib/assets/');

				imports.push(`import ${importName} from '${resolvedPath}?enhanced';`);

				// Change node type to html to inject the Svelte component
				node.type = 'html';
				node.value = `<MarkdownImage src={${importName}} alt="${alt || ''}" class="my-8 w-full h-auto rounded-xl shadow-lg" />`;
			}
			// Handle relative paths (e.g. ./cover.jpg)
			else if (url.startsWith('./') && file.filename) {
				const importName = `enhanced_image_${count++}`;
				const markdownDir = path.dirname(file.filename);
				// Resolve relative to the markdown file
				const absolutePath = path.resolve(markdownDir, url);

				// We need a path that Vite can import. Absolute paths usually work in Vite if they are within project root.
				// Or we can convert to $lib relative path if inside src/lib.

				// For simplicity, let's try the absolute path first, but ensure it's properly escaped if needed.
				// But wait, if we import from absolute path in the generated svelte component, it should work.

				imports.push(`import ${importName} from '${absolutePath}?enhanced';`);

				node.type = 'html';
				node.value = `<MarkdownImage src={${importName}} alt="${alt || ''}" class="my-8 w-full h-auto rounded-xl shadow-lg" />`;
			}
		});

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
				}
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
