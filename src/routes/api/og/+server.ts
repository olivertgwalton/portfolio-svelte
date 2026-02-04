import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';
import { html as toReactNode } from 'satori-html';
import { render } from 'svelte/server';
import OgImage from '$lib/components/OgImage.svelte';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, fetch }) => {
	const title = url.searchParams.get('title') ?? 'Oliver Walton';
	const description = url.searchParams.get('description') ?? 'Software Engineer';

	// Fetch font
	const fontData = await fetch(
		'https://cdn.jsdelivr.net/fontsource/fonts/space-grotesk@latest/latin-700-normal.woff'
	).then((res) => res.arrayBuffer());

	// Render the Svelte component to HTML string
	const result = render(OgImage, { props: { title, description } });

	// Convert HTML string to Satori-compatible React Node objects
	const markup = toReactNode(result.body);

	// Generate SVG with Satori
	const svg = await satori(markup, {
		width: 1200,
		height: 630,
		fonts: [
			{
				name: 'Space Grotesk',
				data: fontData,
				weight: 700,
				style: 'normal'
			}
		]
	});

	// Convert SVG to PNG with Resvg
	const resvg = new Resvg(svg);
	const png = resvg.render();
	const pngBuffer = png.asPng();

	return new Response(new Uint8Array(pngBuffer), {
		headers: {
			'Content-Type': 'image/png',
			'Cache-Control': 'public, max-age=600'
		}
	});
};
