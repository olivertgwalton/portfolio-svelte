export interface TocHeading {
	id: string;
	text: string;
	depth: number;
}

export function createTableOfContents() {
	let headings = $state<TocHeading[]>([]);
	let activeId = $state('');
	let manualScroll = false;
	let scrollEndTimeout: ReturnType<typeof setTimeout>;

	function updateHeadings() {
		headings = Array.from(document.querySelectorAll('.prose h2, .prose h3')).map((elem) => ({
			id: elem.id,
			text: elem.textContent,
			depth: Number(elem.tagName.substring(1))
		}));
	}

	function onScroll() {
		clearTimeout(scrollEndTimeout);
		scrollEndTimeout = setTimeout(() => {
			manualScroll = false;
			window.removeEventListener('scroll', onScroll);
		}, 100);
	}

	function scrollToHeading(id: string) {
		const el = document.getElementById(id);
		if (!el) return;

		manualScroll = true;
		window.addEventListener('scroll', onScroll, { passive: true });
		el.scrollIntoView({ behavior: 'smooth' });

		activeId = id;
		history.replaceState(history.state, '', `#${id}`);
	}

	function init() {
		$effect(() => {
			updateHeadings();

			// Only observe the .prose container instead of the entire document
			const prose = document.querySelector('.prose');
			if (!prose) return;

			const observer = new MutationObserver(() => requestAnimationFrame(updateHeadings));
			observer.observe(prose, { childList: true, subtree: true });
			return () => {
				observer.disconnect();
			};
		});

		$effect(() => {
			const elements = headings
				.map((h) => document.getElementById(h.id))
				.filter((el) => el !== null);

			const observer = new IntersectionObserver(
				(entries) => {
					if (manualScroll) return;
					for (const entry of entries) {
						if (entry.isIntersecting) activeId = entry.target.id;
					}
				},
				{ rootMargin: '-120px 0px -66% 0px' }
			);

			elements.forEach((elem) => {
				observer.observe(elem);
			});
			return () => {
				observer.disconnect();
			};
		});
	}

	return {
		get headings() {
			return headings;
		},
		get activeId() {
			return activeId;
		},
		scrollToHeading,
		init
	};
}
