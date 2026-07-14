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
		'/src/lib/assets/**/*.{jpg,jpeg,png,webp,avif}',
		'/src/lib/blogs/**/*.{jpg,jpeg,png,webp,avif}',
		'/src/lib/projects/**/*.{jpg,jpeg,png,webp,avif}'
	],
	{
		eager: true,
		query: { enhanced: true, w: '410;640;724;820;1024;1200;1600' }
	}
);

// Cache resolved images to avoid re-scanning the glob
const cache = new Map<string, Picture | string>();

/**
 * Resolves a frontmatter image path (e.g., '/assets/blog/image.jpg')
 * to the imported enhanced image module.
 */
export function getEnhancedImage(path: string | undefined): Picture | string | null {
	if (!path) return null;

	const cached = cache.get(path);
	if (cached !== undefined) return cached;

	const suffix = path.replace(/^\/assets/, '');

	const match = Object.entries(images).find(([key]) => key.endsWith(suffix));
	if (!match) return null;

	const result = match[1].default;
	cache.set(path, result);
	return result;
}
