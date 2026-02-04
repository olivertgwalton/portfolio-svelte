import type { Action } from 'svelte/action';

interface RevealParams {
	delay?: number;
	duration?: number;
	y?: number;
	threshold?: number;
}

export const reveal: Action<HTMLElement, RevealParams> = (node, params = {}) => {
	const { delay = 0, duration = 800, y = 20, threshold = 0.1 } = params;

	// Guard: If already animated, don't re-animate
	if (node.dataset.revealed === 'true') {
		node.style.opacity = '1';
		return { destroy() {} };
	}

	// Set initial state
	node.style.opacity = '0';
	node.style.transform = `translateY(${y}px)`;

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					// Mark as revealed to prevent re-animation
					node.dataset.revealed = 'true';

					// Disable CSS transitions temporarily to prevent conflict with WAAPI
					const originalTransition = node.style.transition;
					node.style.transition = 'none';

					// Trigger WAAPI Animation
					const animation = node.animate(
						[
							{ opacity: 0, transform: `translateY(${y}px)` },
							{ opacity: 1, transform: 'translateY(0)' }
						],
						{
							duration: duration,
							delay: delay,
							easing: 'cubic-bezier(0.2, 0, 0.2, 1)',
							fill: 'forwards'
						}
					);

					// Clean up after animation
					animation.onfinish = () => {
						// Apply final styles directly
						node.style.opacity = '1';
						node.style.transform = 'translateY(0)';
						// Restore transitions after a frame to avoid flash
						requestAnimationFrame(() => {
							node.style.transition = originalTransition;
						});
					};

					observer.unobserve(node);
				}
			});
		},
		{
			threshold,
			rootMargin: '0px'
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
