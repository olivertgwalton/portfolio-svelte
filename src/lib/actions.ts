import { mount, unmount } from 'svelte';
import CopyButton from '$lib/components/markdown/CopyButton.svelte';
import type { Action } from 'svelte/action';

interface RevealParams {
	delay?: number;
	duration?: number;
	y?: number;
}

export const reveal: Action<HTMLElement, RevealParams> = (el, params = {}) => {
	const { delay = 0, duration = 600, y = 20 } = params;

	// Skip if already revealed
	if (el.dataset.revealed === 'true') {
		el.style.opacity = '1';
		return { destroy() {} };
	}

	// Initial hidden state
	el.style.opacity = '0';
	el.style.transform = `translateY(${y}px)`;

	const observer = new IntersectionObserver(
		([entry]) => {
			if (entry.isIntersecting) {
				el.dataset.revealed = 'true';
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

				observer.disconnect();
			}
		},
		{ threshold: 0.1 }
	);

	observer.observe(el);

	return { destroy: () => observer.disconnect() };
};

export const enhanceCodeBlocks: Action<HTMLElement> = (node) => {
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
			components.forEach((c) => unmount(c));
		}
	};
};
