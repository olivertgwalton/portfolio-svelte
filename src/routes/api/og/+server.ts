import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, fetch }) => {
	const title = url.searchParams.get('title') ?? 'Oliver Walton';
	const description = url.searchParams.get('description') ?? 'Software Engineer';

	// Fetch font
	const fontData = await fetch(
		'https://cdn.jsdelivr.net/fontsource/fonts/space-grotesk@latest/latin-700-normal.woff'
	).then((res) => res.arrayBuffer());

	// Define the layout manually as a Satori VNode object
	// This bypasses satori-html/ultrahtml and the Bun compatibility issue.
	const markup = {
		type: 'div',
		props: {
			style: {
				height: '100%',
				width: '100%',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'space-between',
				backgroundColor: '#0a0a0a', // Modern Dark (Deep Black)
				padding: '60px',
				fontFamily: 'Space Grotesk'
			},
			children: [
				// Top Bar / Brand
				{
					type: 'div',
					props: {
						style: {
							display: 'flex',
							width: '100%',
							justifyContent: 'space-between',
							alignItems: 'center'
						},
						children: [
							{
								type: 'div',
								props: {
									style: { display: 'flex', alignItems: 'center', gap: '12px' },
									children: [
										{
											type: 'div',
											props: {
												style: {
													width: '40px',
													height: '40px',
													borderRadius: '50%',
													backgroundColor: '#fffcf5', // Cream Circle
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
													fontWeight: 900,
													color: '#0a0a0a', // Black Text
													fontSize: '20px'
												},
												children: 'OW'
											}
										},
										{
											type: 'div',
											props: {
												style: {
													color: '#fffcf5', // Cream Text
													fontWeight: 700,
													fontSize: '24px',
													letterSpacing: '-0.02em'
												},
												children: 'oliverwalton.uk'
											}
										}
									]
								}
							},
							{
								type: 'div',
								props: {
									style: {
										color: '#9ca3af', // Muted Gray (Surface 400)
										fontWeight: 600,
										fontSize: '18px',
										textTransform: 'uppercase',
										letterSpacing: '0.1em'
									},
									children: 'Portfolio'
								}
							}
						]
					}
				},
				// Main Content
				{
					type: 'div',
					props: {
						style: {
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'flex-start',
							width: '100%',
							marginTop: '40px',
							marginBottom: '60px'
						},
						children: [
							{
								type: 'div',
								props: {
									style: {
										display: 'flex',
										backgroundColor: '#ff8ea6', // Pink Accent
										color: '#0a0a0a', // Black Text
										padding: '8px 16px',
										borderRadius: '99px',
										fontSize: '16px',
										fontWeight: 700,
										marginBottom: '32px',
										border: '1px solid #ff8ea6'
									},
									children: 'SOFTWARE ENGINEER'
								}
							},
							{
								type: 'div',
								props: {
									style: {
										display: 'flex',
										fontSize: '80px',
										fontWeight: 800,
										color: '#fffcf5', // Cream Title
										lineHeight: 1.1,
										letterSpacing: '-0.03em',
										marginBottom: '24px',
										textAlign: 'left'
									},
									children: title
								}
							},
							{
								type: 'div',
								props: {
									style: {
										display: 'flex',
										fontSize: '32px',
										fontWeight: 400,
										color: '#d1d5db', // Surface 300 Desc
										lineHeight: 1.5,
										maxWidth: '900px',
										textAlign: 'left'
									},
									children: description
								}
							}
						]
					}
				},
				// Footer
				{
					type: 'div',
					props: {
						style: {
							display: 'flex',
							width: '100%',
							paddingTop: '40px',
							borderTop: '1px solid #374151', // Surface 700 Border
							justifyContent: 'flex-start',
							gap: '32px'
						},
						children: [
							{
								type: 'div',
								props: {
									style: { display: 'flex', flexDirection: 'column', gap: '8px' },
									children: [
										{
											type: 'span',
											props: {
												style: {
													color: '#ff8ea6', // Pink Label
													fontSize: '14px',
													fontWeight: 700,
													textTransform: 'uppercase'
												},
												children: 'Stack'
											}
										},
										{
											type: 'span',
											props: {
												style: { color: '#fffcf5', fontSize: '20px', fontWeight: 600 }, // Cream Value
												children: 'SvelteKit & Tailwind'
											}
										}
									]
								}
							},
							{
								type: 'div',
								props: {
									style: { display: 'flex', flexDirection: 'column', gap: '8px' },
									children: [
										{
											type: 'span',
											props: {
												style: {
													color: '#ff8ea6',
													fontSize: '14px',
													fontWeight: 700,
													textTransform: 'uppercase'
												},
												children: 'Focus'
											}
										},
										{
											type: 'span',
											props: {
												style: { color: '#fffcf5', fontSize: '20px', fontWeight: 600 },
												children: 'Frontend Architecture'
											}
										}
									]
								}
							},
							{
								type: 'div',
								props: {
									style: { display: 'flex', flexDirection: 'column', gap: '8px' },
									children: [
										{
											type: 'span',
											props: {
												style: {
													color: '#ff8ea6',
													fontSize: '14px',
													fontWeight: 700,
													textTransform: 'uppercase'
												},
												children: 'Systems'
											}
										},
										{
											type: 'span',
											props: {
												style: { color: '#fffcf5', fontSize: '20px', fontWeight: 600 },
												children: 'Linux & Embedded'
											}
										}
									]
								}
							}
						]
					}
				}
			]
		}
	};

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
