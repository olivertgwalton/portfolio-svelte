import { Renderer } from '@takumi-rs/core';
import { container, text } from '@takumi-rs/helpers';
import type { RequestHandler } from './$types';

const renderer = new Renderer();

export const GET: RequestHandler = async ({ url }) => {
	const title = url.searchParams.get('title') ?? 'Oliver Walton';
	const description = url.searchParams.get('description') ?? 'Software Engineer';

	const node = container({
		tw: 'flex flex-col justify-between bg-[#0a0a0a] p-[60px] w-full h-full',
		children: [
			// Top Bar
			container({
				tw: 'flex w-full justify-between items-center',
				children: [
					container({
						tw: 'flex items-center gap-3',
						children: [
							container({
								tw: 'flex items-center justify-center w-10 h-10 rounded-full bg-[#fffcf5]',
								children: [
									text({
										text: 'OW',
										tw: 'text-[#0a0a0a] text-xl font-black'
									})
								]
							}),
							text({
								text: 'oliverwalton.uk',
								tw: 'text-[#fffcf5] text-2xl font-bold tracking-tight'
							})
						]
					}),
					text({
						text: 'Portfolio',
						tw: 'text-[#9ca3af] text-lg font-semibold uppercase tracking-widest'
					})
				]
			}),
			// Main Content
			container({
				tw: 'flex flex-col items-start w-full mt-10 mb-[60px]',
				children: [
					container({
						tw: 'flex bg-[#ff8ea6] text-[#0a0a0a] px-4 py-2 rounded-full text-base font-bold mb-8',
						children: [text({ text: 'SOFTWARE ENGINEER' })]
					}),
					text({
						text: title,
						tw: 'text-[80px] font-extrabold text-[#fffcf5] leading-none tracking-tighter mb-6'
					}),
					text({
						text: description,
						tw: 'text-[32px] text-[#d1d5db] leading-snug max-w-[900px]'
					})
				]
			}),
			// Footer
			container({
				tw: 'flex w-full pt-10 border-t border-[#374151] gap-8',
				children: [
					footerItem('Stack', 'SvelteKit & Tailwind'),
					footerItem('Focus', 'Frontend Architecture'),
					footerItem('Systems', 'Linux & Embedded')
				]
			})
		]
	});

	const png = await renderer.render(node, {
		width: 1200,
		height: 630,
		format: 'png'
	});

	return new Response(new Uint8Array(png), {
		headers: {
			'Content-Type': 'image/png',
			'Cache-Control': 'public, max-age=600'
		}
	});
};

function footerItem(label: string, value: string) {
	return container({
		tw: 'flex flex-col gap-2',
		children: [
			text({
				text: label,
				tw: 'text-[#ff8ea6] text-sm font-bold uppercase'
			}),
			text({
				text: value,
				tw: 'text-[#fffcf5] text-xl font-semibold'
			})
		]
	});
}
