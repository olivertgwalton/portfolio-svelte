import type { Action } from 'svelte/action';

interface RevealParams {
	delay?: number;
	duration?: number;
	y?: number;
	threshold?: number;
}

export const reveal: Action<HTMLElement, RevealParams> = (node, params = {}) => {
	const { delay = 0, duration = 800, y = 30, threshold = 0.1 } = params;

	// Initial state
	node.style.opacity = '0';
	node.style.transform = `translateY(${y}px)`;
	node.style.willChange = 'opacity, transform';
	node.style.transition = `opacity ${duration}ms cubic-bezier(0.2, 0.0, 0.2, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.2, 0.0, 0.2, 1) ${delay}ms`;

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					// Reveal state
					node.style.opacity = '1';
					node.style.transform = 'translateY(0)';

					const totalTime = duration + delay;
					setTimeout(() => {
						node.style.willChange = 'auto';
						// Keep transition for responsiveness if needed, or remove.
						// Removing helps prevent interference with other transforms like tilt.
						node.style.transition = '';
					}, totalTime);

					observer.unobserve(node);
				}
			});
		},
		{
			threshold,
			rootMargin: '0px 0px -50px 0px'
		}
	);

	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
		}
	};
};

interface TiltParams {
	max?: number; // max tilt rotation (degrees)
	scale?: number; // transform scale on hover
	speed?: number; // transition speed (ms)
}

export const tilt: Action<HTMLElement, TiltParams> = (node, params = {}) => {
	const { max = 5, scale = 1.02, speed = 400 } = params;

	let bounds: DOMRect;

	function handleMouseEnter() {
		bounds = node.getBoundingClientRect();
		node.style.transition = `transform ${speed}ms cubic-bezier(0.03, 0.98, 0.52, 0.99)`;
	}

	function handleMouseMove(e: MouseEvent) {
		if (!bounds) return;

		const x = e.clientX - bounds.left;
		const y = e.clientY - bounds.top;

		const xPct = x / bounds.width;
		const yPct = y / bounds.height;

		const xRot = (yPct - 0.5) * max * -1; // Invert for natural feel
		const yRot = (xPct - 0.5) * max;

		node.style.transform = `perspective(1000px) rotateX(${xRot}deg) rotateY(${yRot}deg) scale3d(${scale}, ${scale}, ${scale})`;
	}

	function handleMouseLeave() {
		node.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
	}

	node.addEventListener('mouseenter', handleMouseEnter);
	node.addEventListener('mousemove', handleMouseMove);
	node.addEventListener('mouseleave', handleMouseLeave);

	return {
		destroy() {
			node.removeEventListener('mouseenter', handleMouseEnter);
			node.removeEventListener('mousemove', handleMouseMove);
			node.removeEventListener('mouseleave', handleMouseLeave);
		}
	};
};
