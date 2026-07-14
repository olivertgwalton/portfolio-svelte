import {
	getItemTags,
	type Collection,
	type ContentMetadata,
	type ContentType
} from './content-types';

export type { Collection, ContentMetadata, ContentType };
export { getItemTags };

// Globs need static string-literal patterns and an inline options object so
// Vite can analyse them at build time.
const filesByType: Record<ContentType, Record<string, unknown>> = {
	blogs: import.meta.glob('/src/lib/blogs/**/index.md', { eager: true, import: 'metadata' }),
	projects: import.meta.glob('/src/lib/projects/**/index.md', { eager: true, import: 'metadata' }),
	experience: import.meta.glob('/src/lib/experience/*.md', { eager: true, import: 'metadata' }),
	education: import.meta.glob('/src/lib/education/*.md', { eager: true, import: 'metadata' }),
	certifications: import.meta.glob('/src/lib/certifications/*.md', {
		eager: true,
		import: 'metadata'
	})
};

function resolveImage(type: ContentType, slug: string, image?: string) {
	if (!image?.startsWith('./')) return image;
	return `/src/lib/${type}/${slug}/${image.slice(2)}`;
}

// The metadata glob omits the slug; fold it (and the resolved image) back in.
function toMetadata(type: ContentType, slug: string, file: unknown): ContentMetadata {
	const metadata = file as Omit<ContentMetadata, 'slug'>;
	return { slug, ...metadata, image: resolveImage(type, slug, metadata.image) };
}

export function getContentList(type: ContentType): ContentMetadata[] {
	return Object.entries(filesByType[type])
		.map(([path, file]) => {
			const parts = path.split('/');
			return toMetadata(type, parts[parts.length - 2], file);
		})
		.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getRelatedContent(
	type: ContentType,
	slug: string,
	tags: string[] = [],
	limit = 3
): ContentMetadata[] {
	if (tags.length === 0) return [];

	const all = getContentList(type);
	const tagSet = new Set(tags.map((t) => t.toLowerCase()));

	return all
		.filter((item) => item.slug !== slug)
		.map((item) => {
			const overlap = getItemTags(item).filter((t) => tagSet.has(t.toLowerCase())).length;
			return { item, overlap };
		})
		.filter(({ overlap }) => overlap > 0)
		.sort(
			(a, b) =>
				b.overlap - a.overlap || new Date(b.item.date).getTime() - new Date(a.item.date).getTime()
		)
		.slice(0, limit)
		.map(({ item }) => item);
}

export function getAdjacentContent(
	type: ContentType,
	slug: string
): { prev: ContentMetadata | null; next: ContentMetadata | null } {
	// getContentList is sorted newest -> oldest, so the neighbour at idx - 1 is
	// newer ("next") and idx + 1 is older ("prev").
	const all = getContentList(type);
	const idx = all.findIndex((item) => item.slug === slug);
	if (idx === -1) return { prev: null, next: null };

	return {
		next: idx > 0 ? all[idx - 1] : null,
		prev: idx < all.length - 1 ? all[idx + 1] : null
	};
}

export function getContentItem(type: ContentType, slug: string): ContentMetadata | null {
	const file = filesByType[type][`/src/lib/${type}/${slug}/index.md`];
	return file ? toMetadata(type, slug, file) : null;
}
