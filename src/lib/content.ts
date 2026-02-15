// Hoist globs to top level for static analysis
const postFiles = import.meta.glob('/src/lib/posts/**/index.md', { eager: true });
const projectFiles = import.meta.glob('/src/lib/projects/**/index.md', { eager: true });
const experienceFiles = import.meta.glob('/src/lib/experience/*.md', { eager: true });
const educationFiles = import.meta.glob('/src/lib/education/*.md', { eager: true });
const certificationFiles = import.meta.glob('/src/lib/certifications/*.md', { eager: true });

export interface ContentMetadata {
	slug: string;
	title: string;
	description: string;
	date: string;
	image?: string;
	tags?: string[];
	tech?: string[];
	type?: string;
	github?: string;
	demo?: string;
	source?: string;
	link_type?: 'demo' | 'source';
	organization?: string;
	period?: string;
	current?: boolean;
	highlights?: string[];
	skills?: string[];
	readTime?: string;
}

export type ContentType = 'posts' | 'projects' | 'experience' | 'education' | 'certifications';

export function getItemTags(item: ContentMetadata): string[] {
	return [...(item.tags ?? []), ...(item.tech ?? [])];
}

function resolveImage(slug: string, type: ContentType, image?: string) {
	if (!image?.startsWith('./')) return image;
	// Resolve relative path ./cover.jpg -> /src/lib/posts/slug/cover.jpg
	const dir = type === 'posts' ? 'posts' : 'projects';
	return `/src/lib/${dir}/${slug}/${image.slice(2)}`;
}

export function getContentList(type: ContentType): ContentMetadata[] {
	let files: Record<string, unknown>;

	switch (type) {
		case 'posts':
			files = postFiles;
			break;
		case 'projects':
			files = projectFiles;
			break;
		case 'experience':
			files = experienceFiles;
			break;
		case 'education':
			files = educationFiles;
			break;
		case 'certifications':
			files = certificationFiles;
			break;
		default:
			return [];
	}

	return Object.entries(files)
		.map(([path, file]) => {
			// Extract slug from parent directory: /src/lib/posts/hello-world/index.md -> hello-world
			const parts = path.split('/');
			const slug = parts[parts.length - 2];

			const metadata = (file as { metadata: Omit<ContentMetadata, 'slug'> }).metadata;
			return {
				slug,
				...metadata,
				image: resolveImage(slug, type, metadata.image)
			};
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

export function getContentItem(type: ContentType, slug: string): ContentMetadata | null {
	const files = type === 'posts' ? postFiles : projectFiles;
	const dir = type === 'posts' ? 'posts' : 'projects';

	// Direct lookup for directory based structure
	const path = `/src/lib/${dir}/${slug}/index.md`;
	const file = files[path];

	if (!file) return null;
	const metadata = (file as { metadata: Omit<ContentMetadata, 'slug'> }).metadata;

	return {
		slug,
		...metadata,
		image: resolveImage(slug, type, metadata.image)
	};
}
