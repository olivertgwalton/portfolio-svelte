import { getContentList } from '$lib/content';
import type { RequestHandler } from './$types';

const SITE_URL = 'https://oliverwalton.uk';

export const GET: RequestHandler = () => {
	const posts = getContentList('posts');
	const projects = getContentList('projects');

	const staticPages = [
		{ path: '/', priority: '1.0' },
		{ path: '/about', priority: '0.8' },
		{ path: '/contact', priority: '0.7' },
		{ path: '/blog', priority: '0.9' },
		{ path: '/projects', priority: '0.9' }
	];

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages
	.map(
		(page) => `  <url>
    <loc>${SITE_URL}${page.path}</loc>
    <priority>${page.priority}</priority>
  </url>`
	)
	.join('\n')}
${posts
	.map(
		(post) => `  <url>
    <loc>${SITE_URL}/blog/${post.slug}</loc>
    <lastmod>${new Date(post.date).toISOString().split('T')[0]}</lastmod>
    <priority>0.7</priority>
  </url>`
	)
	.join('\n')}
${projects
	.map(
		(project) => `  <url>
    <loc>${SITE_URL}/projects/${project.slug}</loc>
    <lastmod>${new Date(project.date).toISOString().split('T')[0]}</lastmod>
    <priority>0.7</priority>
  </url>`
	)
	.join('\n')}
</urlset>`;

	return new Response(xml.trim(), {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=3600'
		}
	});
};
