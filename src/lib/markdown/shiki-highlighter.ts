import { escapeSvelte } from 'mdsvex';
import { createHighlighter } from 'shiki';

const escapeAttr = (s: string) =>
	s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export async function createMdsvexHighlighter() {
	const highlighter = await createHighlighter({
		themes: ['github-light', 'github-dark'],
		langs: [
			'typescript',
			'javascript',
			'svelte',
			'bash',
			'css',
			'html',
			'json',
			'markdown',
			'python',
			'rust'
		]
	});

	return (code: string, lang = 'text', meta = '') => {
		const html = highlighter.codeToHtml(code, {
			lang,
			themes: { light: 'github-light', dark: 'github-dark' },
			defaultColor: false
		});
		const titleMatch = meta?.match(/title="([^"]+)"/);
		const titleAttr = titleMatch ? ` data-title="${escapeAttr(titleMatch[1])}"` : '';
		const withLang = html.replace('<pre ', `<pre data-language="${lang}"${titleAttr} `);
		return `{@html \`${escapeSvelte(withLang)}\`}`;
	};
}
