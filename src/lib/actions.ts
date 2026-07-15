import { mount, unmount } from 'svelte';
import CopyButton from '$lib/components/markdown/CopyButton.svelte';
import HeadingLink from '$lib/components/markdown/HeadingLink.svelte';
import type { Action } from 'svelte/action';

interface RevealParams {
	delay?: number;
	duration?: number;
	y?: number;
}

// Shared IntersectionObserver for all reveal elements
const revealElements = new WeakMap<Element, RevealParams>();
let sharedObserver: IntersectionObserver | null = null;

function getSharedObserver(): IntersectionObserver {
	if (sharedObserver) return sharedObserver;

	sharedObserver = new IntersectionObserver(
		(entries, observer) => {
			for (const entry of entries) {
				const el = entry.target as HTMLElement;
				const params = revealElements.get(el) ?? {};
				const { delay = 0, duration = 600, y = 20 } = params;

				if (!entry.isIntersecting) {
					if (el.dataset.revealHidden !== 'true') {
						el.dataset.revealHidden = 'true';
						el.style.opacity = '0';
						el.style.transform = `translateY(${y}px)`;
					}
					continue;
				}

				el.dataset.revealed = 'true';

				if (el.dataset.revealHidden === 'true') {
					el.style.transition = 'none';
					el.animate(
						[
							{ opacity: 0, transform: `translateY(${y}px)` },
							{ opacity: 1, transform: 'translateY(0)' }
						],
						{ duration, delay, easing: 'ease-out', fill: 'forwards' }
					).onfinish = () => {
						el.style.opacity = '1';
						el.style.transform = 'translateY(0)';
						el.style.transition = '';
					};
				}

				observer.unobserve(el);
				revealElements.delete(el);
			}
		},
		{ threshold: 0.1 }
	);

	return sharedObserver;
}

export const reveal: Action<HTMLElement, RevealParams> = (el, params = {}) => {
	if (el.dataset.revealed === 'true') {
		el.style.opacity = '1';
		return;
	}


	revealElements.set(el, params);
	getSharedObserver().observe(el);

	return {
		destroy() {
			getSharedObserver().unobserve(el);
			revealElements.delete(el);
		}
	};
};

// Replace the self-links appended to headings by rehype-autolink-headings with
// a copy-link button (same design as the share widget): a link icon that
// becomes a green check on copy, and no jump-to-anchor scroll (it's a button).
export const enhanceHeadings: Action = (node) => {
	const anchors = node.querySelectorAll<HTMLAnchorElement>('a.heading-anchor');
	const components: ReturnType<typeof mount>[] = [];

	for (const anchor of anchors) {
		const heading = anchor.parentElement;
		const hash = anchor.getAttribute('href') ?? '';
		anchor.remove();
		if (!heading) continue;

		components.push(mount(HeadingLink, { target: heading, props: { hash } }));
	}

	return {
		destroy() {
			components.forEach((c) => void unmount(c));
		}
	};
};

export const enhanceCodeBlocks: Action = (node) => {
	const components: ReturnType<typeof mount>[] = [];
	const pres = node.querySelectorAll('pre');

	for (const pre of pres) {
		pre.classList.add('relative', 'group');

		const title = pre.dataset.title;
		if (title) {
			const lang = pre.dataset.language ?? '';
			const wrapper = document.createElement('div');
			wrapper.className = 'code-block-wrapper';
			pre.parentElement?.insertBefore(wrapper, pre);
			const header = document.createElement('div');
			header.className = 'code-block-header';
			const titleSpan = document.createElement('span');
			titleSpan.textContent = title;
			header.appendChild(titleSpan);
			if (lang) {
				const langSpan = document.createElement('span');
				langSpan.className = 'code-block-lang';
				langSpan.textContent = lang;
				header.appendChild(langSpan);
			}
			wrapper.appendChild(header);
			wrapper.appendChild(pre);
		}

		const component = mount(CopyButton, {
			target: pre,
			props: { text: pre.innerText }
		});
		components.push(component);
	}

	return {
		destroy() {
			components.forEach((c) => void unmount(c));
		}
	};
};
