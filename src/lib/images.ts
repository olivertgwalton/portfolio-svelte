// Centralized image resolution for enhanced images
// Eagerly load all images to ensure they are available for synchronous resolution
const images = import.meta.glob(
	[
		'/src/lib/assets/**/*.{jpg,jpeg,png,webp,avif}',
		'/src/lib/posts/**/*.{jpg,jpeg,png,webp,avif}',
		'/src/lib/projects/**/*.{jpg,jpeg,png,webp,avif}'
	],
	{
		query: { enhanced: true },
		eager: true
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

/**
 * Resolves a frontmatter image path (e.g., '/assets/blog/image.jpg')
 * to the imported enhanced image module.
 */
export function getEnhancedImage(path: string | undefined): Picture | string | null {
	if (!path) return null;

	// path is typically '/assets/blog/image.jpg'
	// We want to match any key that ends with '/blog/image.jpg'
	// removing the '/assets' prefix from the input path to search against the glob keys
	// which will be like '/src/lib/assets/blog/image.jpg'

	const suffix = path.replace(/^\/assets/, '');
	// suffix is now '/blog/image.jpg'

	const match = Object.entries(images).find(([key]) => key.endsWith(suffix));
	return match ? (match[1] as { default: Picture | string }).default : null;
}
