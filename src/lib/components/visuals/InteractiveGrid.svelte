<script lang="ts">
	import { onMount } from 'svelte';

	// Svelte 5 Runes for element binding
	let canvas = $state<HTMLCanvasElement>();

	let { fixed = false, spacing = 40 } = $props();

	// Physics Constants (Base values in CSS pixels, will be scaled by DPR)
	const BASE_DOT_RADIUS = 1.5;
	const BASE_MOUSE_RADIUS = 250;
	const PUSH_FORCE = 0.7;
	const SPRING_STIFFNESS = 0.02;
	const FRICTION = 0.85;

	// Calculated Constants (Scaled by DPR)
	let dotRadius = 0;
	let mouseRadiusSq = 0;

	// State - Standard variables for high-frequency updates/internal state
	let mouseX = -1000;
	let mouseY = -1000;
	let width = 0;
	let height = 0;
	let dpr = 1;
	let dotColor = 'rgb(0, 0, 0)';
	let canvasOffset = { left: 0, top: 0 };

	// SoA (Structure of Arrays) for performance
	let xCoords: Float32Array;
	let yCoords: Float32Array;
	let originX: Float32Array;
	let originY: Float32Array;
	let vx: Float32Array;
	let vy: Float32Array;
	let numPoints = 0;

	let ctx: CanvasRenderingContext2D | null = null;
	let animationId: number;

	let lastSpacing: number;

	function initGrid() {
		if (!canvas) return;

		dpr = window.devicePixelRatio || 1;
		const rect = canvas.getBoundingClientRect();
		width = canvas.offsetWidth;
		height = canvas.offsetHeight;

		canvas.width = width * dpr;
		canvas.height = height * dpr;

		canvasOffset.left = rect.left + window.scrollX;
		canvasOffset.top = rect.top + window.scrollY;

		// Update scaled constants
		dotRadius = BASE_DOT_RADIUS * dpr;
		const scaledMouseRadius = BASE_MOUSE_RADIUS * dpr;
		mouseRadiusSq = scaledMouseRadius * scaledMouseRadius;

		const cols = Math.ceil(width / spacing) + 2;
		const rows = Math.ceil(height / spacing) + 2;
		numPoints = cols * rows;

		// Initialize TypedArrays
		xCoords = new Float32Array(numPoints);
		yCoords = new Float32Array(numPoints);
		originX = new Float32Array(numPoints);
		originY = new Float32Array(numPoints);
		vx = new Float32Array(numPoints);
		vy = new Float32Array(numPoints);

		let index = 0;
		for (let i = 0; i < cols; i++) {
			for (let j = 0; j < rows; j++) {
				const x = (i - 1) * spacing * dpr;
				const y = (j - 1) * spacing * dpr;
				xCoords[index] = x;
				yCoords[index] = y;
				originX[index] = x;
				originY[index] = y;
				vx[index] = 0;
				vy[index] = 0;
				index++;
			}
		}
	}

	function updateThemeColor() {
		if (typeof window === 'undefined') return;
		const style = getComputedStyle(document.body);
		let color = style.color || 'rgb(0, 0, 0)';

		// Convert any rgba/hsla color to its opaque version (rgb/hsl)
		// This handles both comma-separated "(r, g, b, a)" and space/slash "(r g b / a)" syntax
		if (color.includes('rgba') || color.includes('hsla')) {
			color = color
				.replace(/rgba?\(/, 'rgb(')
				.replace(/hsla?\(/, 'hsl(')
				.replace(/[,/]\s*[\d.]+\)$/, ')');
		}

		// Visibility Fix: If theme color is black (on dark bg), force white.
		if (color.includes('0, 0, 0') || color === 'black' || color === 'rgb(0, 0, 0)') {
			dotColor = 'rgb(255, 255, 255)';
		} else {
			dotColor = color;
		}
	}

	function animate() {
		// Cleanest Svelte 5 approach: Handle prop changes in the loop
		if (spacing !== lastSpacing) {
			lastSpacing = spacing;
			initGrid();
		}

		if (!ctx || numPoints === 0) {
			animationId = requestAnimationFrame(animate);
			return;
		}

		ctx.clearRect(0, 0, width * dpr, height * dpr);

		const scaledMouseRadius = BASE_MOUSE_RADIUS * dpr;

		ctx.globalAlpha = 0.15;
		ctx.fillStyle = dotColor;
		ctx.beginPath();

		for (let i = 0; i < numPoints; i++) {
			// Physics: Already in pixel space
			const dx = mouseX - xCoords[i];
			const dy = mouseY - yCoords[i];
			const distSq = dx * dx + dy * dy;

			if (distSq < mouseRadiusSq) {
				const dist = Math.sqrt(distSq);
				const invDist = 1 / dist;
				const force = (scaledMouseRadius - dist) / scaledMouseRadius;
				const push = -force * PUSH_FORCE * dpr;

				vx[i] += dx * invDist * push;
				vy[i] += dy * invDist * push;
			}

			const ex = originX[i] - xCoords[i];
			const ey = originY[i] - yCoords[i];

			vx[i] += ex * SPRING_STIFFNESS;
			vy[i] += ey * SPRING_STIFFNESS;

			vx[i] *= FRICTION;
			vy[i] *= FRICTION;

			xCoords[i] += vx[i];
			yCoords[i] += vy[i];

			// Render: Batching into a single path
			ctx.moveTo(xCoords[i] + dotRadius, yCoords[i]);
			ctx.arc(xCoords[i], yCoords[i], dotRadius, 0, Math.PI * 2);
		}

		ctx.fill();
		animationId = requestAnimationFrame(animate);
	}

	function handleResize() {
		initGrid();
		updateThemeColor();
	}

	function handleMouseMove(e: MouseEvent) {
		if (fixed) {
			mouseX = e.clientX * dpr;
			mouseY = e.clientY * dpr;
		} else {
			const currentLeft = canvasOffset.left - window.scrollX;
			const currentTop = canvasOffset.top - window.scrollY;
			mouseX = (e.clientX - currentLeft) * dpr;
			mouseY = (e.clientY - currentTop) * dpr;
		}
	}

	function handleMouseLeave() {
		mouseX = -1000 * dpr;
		mouseY = -1000 * dpr;
	}

	onMount(() => {
		if (!canvas) return;
		ctx = canvas.getContext('2d', { alpha: true });

		updateThemeColor();
		lastSpacing = spacing;
		initGrid();

		const observer = new MutationObserver(updateThemeColor);
		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['class', 'data-theme']
		});

		animationId = requestAnimationFrame(animate);

		window.addEventListener('resize', handleResize);
		window.addEventListener('mousemove', handleMouseMove);
		document.documentElement.addEventListener('mouseleave', handleMouseLeave);

		return () => {
			window.removeEventListener('resize', handleResize);
			window.removeEventListener('mousemove', handleMouseMove);
			document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
			cancelAnimationFrame(animationId);
			observer.disconnect();
		};
	});
</script>

<canvas
	bind:this={canvas}
	class="pointer-events-none inset-0 z-0 h-full w-full {fixed ? 'fixed' : 'absolute'}"
	aria-hidden="true"
></canvas>
