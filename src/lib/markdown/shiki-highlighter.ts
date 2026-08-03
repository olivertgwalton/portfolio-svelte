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
		],
	}));

export async function mdsvexHighlighter(code: string, lang = "text", meta = "") {
	const html = (await getHighlighter()).codeToHtml(code, {
		lang,
		themes: { light: "github-light", dark: "github-dark" },
		defaultColor: false,
	});
	const titleMatch = /title="([^"]+)"/.exec(meta);
	const titleAttr = titleMatch
		? ` data-title="${escapeAttr(titleMatch[1])}"`
		: "";
	const withLang = html.replace(
		"<pre ",
		`<pre data-language="${lang}"${titleAttr} `,
	);
	return `{@html \`${escapeSvelte(withLang)}\`}`;
}
