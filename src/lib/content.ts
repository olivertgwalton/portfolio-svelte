// Hoist globs to top level for static analysis
const postFiles = import.meta.glob('/src/lib/posts/*.md', { eager: true });
const projectFiles = import.meta.glob('/src/lib/projects/*.md', { eager: true });
const experienceFiles = import.meta.glob('/src/lib/experience/*.md', { eager: true });
const educationFiles = import.meta.glob('/src/lib/education/*.md', { eager: true });
export const assetFiles = import.meta.glob(
	'/src/lib/assets/**/*.{avif,gif,heif,jpeg,jpg,png,tiff,webp,svg}',
	{
		query: { enhanced: true },
		eager: true
	}
);

export interface ContentMetadata {
	slug: string;
	title: string;
	description: string;
	date: string;
	image?: string;
	enhancedImage?: EnhancedImage;
	tags?: string[]; // For blog
	tech?: string[]; // For projects
	type?: string; // For projects
	github?: string; // For projects
	demo?: string; // For projects
	// For Experience/Education
	organization?: string;
	period?: string;
	current?: boolean;
	highlights?: string[];
	skills?: string[]; // specialized tech list for experience
}

export type ContentType = 'posts' | 'projects' | 'experience' | 'education';

export interface EnhancedImage {
	sources: Record<string, string>;
	img: {
		src: string;
		w: number;
		h: number;
	};
}

export function resolveEnhancedImage(imagePath?: string): EnhancedImage | undefined {
	if (!imagePath) return undefined;
	// Try exact match, then match without leading slash, then match with leading slash
	const match =
		assetFiles[imagePath] ||
		assetFiles[imagePath.startsWith('/') ? imagePath.slice(1) : '/' + imagePath];

	return (match as { default: EnhancedImage })?.default;
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
		default:
			return [];
	}

	return Object.entries(files)
		.map(([path, file]) => {
			const slug = path.split('/').pop()?.replace('.md', '') || '';
			const metadata = (file as { metadata: Omit<ContentMetadata, 'slug'> }).metadata;
			return {
				slug,
				...metadata,
				enhancedImage: resolveEnhancedImage(metadata.image)
			};
		})
		.sort((a, b) => {
			// Sort by date (newest first)
			// For experience/education, we might want to rely on the 'date' field in frontmatter
			// as a sort key even if 'period' is displayed text.
			return new Date(b.date).getTime() - new Date(a.date).getTime();
		});
}

export function getContentItem(type: ContentType, slug: string): ContentMetadata | null {
	let files: Record<string, unknown>;

	if (type === 'posts') {
		files = postFiles;
		const path = `/src/lib/posts/${slug}.md`;
		const file = files[path];
		if (!file) return null;
		const metadata = (file as { metadata: Omit<ContentMetadata, 'slug'> }).metadata;
		return {
			slug,
			...metadata,
			enhancedImage: resolveEnhancedImage(metadata.image)
		};
	} else {
		files = projectFiles;
		const path = `/src/lib/projects/${slug}.md`;
		const file = files[path];
		if (!file) return null;
		const metadata = (file as { metadata: Omit<ContentMetadata, 'slug'> }).metadata;
		return {
			slug,
			...metadata,
			enhancedImage: resolveEnhancedImage(metadata.image)
		};
	}
}
