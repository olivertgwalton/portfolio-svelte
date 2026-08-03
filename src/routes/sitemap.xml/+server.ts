import { type Collection, getContentList } from "#lib/content";
import type { RequestHandler } from "./$types";

const SITE_URL = "https://oliverwalton.uk";

export const prerender = true;

interface SitemapEntry {
	path: string;
	priority: string;
	lastmod?: string;
}

const collectionEntries = (collection: Collection): SitemapEntry[] =>
	getContentList(collection).map(({ slug, date }) => ({
		path: `/${collection}/${slug}`,
		priority: "0.7",
		lastmod: new Date(date).toISOString().split("T")[0],
	}));

export const GET: RequestHandler = () => {
	const entries: SitemapEntry[] = [
		{ path: "/", priority: "1.0" },
		{ path: "/about", priority: "0.8" },
		{ path: "/contact", priority: "0.7" },
		{ path: "/blogs", priority: "0.9" },
		{ path: "/projects", priority: "0.9" },
		...collectionEntries("blogs"),
		...collectionEntries("projects"),
	];

	const urls = entries
		.map(
			({ path, priority, lastmod }) =>
				`  <url>
    <loc>${SITE_URL}${path}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ""}
    <priority>${priority}</priority>
  </url>`,
		)
		.join("\n");

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

	return new Response(xml.trim(), {
		headers: {
			"Content-Type": "application/xml",
			"Cache-Control": "max-age=3600",
		},
	});
};
