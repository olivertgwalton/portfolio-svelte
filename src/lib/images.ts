interface Picture {
	sources: Record<string, string>;
	img: {
		src: string;
		w: number;
		h: number;
	};
}

const images = import.meta.glob<{ default: Picture | string }>(
	[
		"/src/lib/blogs/**/*.{jpg,jpeg,png,webp,avif}",
		"/src/lib/projects/**/*.{jpg,jpeg,png,webp,avif}",
	],
	{
		eager: true,
		query: { enhanced: true, w: "410;640;724;820;1024;1200;1600" },
	},
);

/** Resolves a frontmatter image path (as produced by content.ts's resolveImage) to its enhanced image module. */
export function getEnhancedImage(
	path: string | undefined,
): Picture | string | null {
	return (path && images[path]?.default) || null;
}
