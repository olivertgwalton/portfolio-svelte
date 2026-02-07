import adapter from '@sveltejs/adapter-vercel';
import { mdsvex, escapeSvelte } from 'mdsvex';
import { createHighlighter } from 'shiki';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const highlighter = await createHighlighter({
	themes: ['github-light', 'github-dark'],
	langs: ['typescript', 'javascript', 'svelte', 'bash', 'css', 'html', 'json', 'markdown']
});

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
	rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
	layout: {
		_: path.resolve(__dirname, './src/lib/components/markdown/MarkdownLayout.svelte')
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
