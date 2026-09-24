import { escapeSvelte } from "mdsvex";
import { createHighlighter, type Highlighter } from "shiki";

const escapeAttr = (s: string) =>
	s
		.replace(/&/g, "&amp;")
		.replace(/"/g, "&quot;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;");

let highlighter: Promise<Highlighter> | undefined;

// Lazily created so vite.config.ts needs no top-level await, which the CJS
// config bundle can't do.
const getHighlighter = () =>
	(highlighter ??= createHighlighter({
		themes: ["github-light", "github-dark"],
		langs: [
			"typescript",
			"javascript",
			"svelte",
			"bash",
			"css",
			"html",
			"json",
			"markdown",
			"python",
            "rust",
			"swift",
		],
	}));

export async function mdsvexHighlighter(
	code: string,
	lang = "text",
	meta = "",
) {
	const html = (await getHighlighter()).codeToHtml(code, {
		lang,
		themes: { light: "github-light", dark: "github-dark" },
		defaultColor: false,
	});
	const withLang = html.replace("<pre ", `<pre data-language="${lang}" `);
	const title = /title="([^"]+)"/.exec(meta)?.[1];
	const block = title
		? `<div class="code-block-wrapper"><div class="code-block-header"><span>${escapeAttr(title)}</span><span class="code-block-lang">${lang}</span></div>${withLang}</div>`
		: withLang;
	return `{@html \`${escapeSvelte(block)}\`}`;
}
