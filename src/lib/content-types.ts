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
