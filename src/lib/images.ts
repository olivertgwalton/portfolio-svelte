// Centralized image resolution for enhanced images
// Lazy-load images to avoid bundling all variants upfront
const images = import.meta.glob(
	[
		'/src/lib/assets/**/*.{jpg,jpeg,png,webp,avif}',
		'/src/lib/posts/**/*.{jpg,jpeg,png,webp,avif}',
		'/src/lib/projects/**/*.{jpg,jpeg,png,webp,avif}'
	],
	{
		query: { enhanced: true, w: '410;640;724;820;1024;1200;1600' }
	}
);

// Type definition compatible with @sveltejs/enhanced-img
type Picture = {
	sources: Record<string, string>;
	img: {
		src: string;
		w: number;
		h: number;
	};
};

// Cache resolved images to avoid re-importing
const cache = new Map<string, Picture | string>();

/**
 * Resolves a frontmatter image path (e.g., '/assets/blog/image.jpg')
 * to the imported enhanced image module.
 */
export async function getEnhancedImage(path: string | undefined): Promise<Picture | string | null> {
	if (!path) return null;

	if (cache.has(path)) return cache.get(path)!;

	const suffix = path.replace(/^\/assets/, '');

	const match = Object.entries(images).find(([key]) => key.endsWith(suffix));
	if (!match) return null;

	const module = (await match[1]()) as { default: Picture | string };
	cache.set(path, module.default);
	return module.default;
}
