<script lang="ts">
	import { onMount } from 'svelte';

	// Svelte 5 Runes for element binding
	let canvas = $state<HTMLCanvasElement>();

	let { fixed = false } = $props();

	// Physics Constants
	const GRID_SPACING = 40;
	const DOT_RADIUS = 1.5;
	const MOUSE_RADIUS = 250; // Increased radius
	const PUSH_FORCE = 0.7; // Increased force
	const SPRING_STIFFNESS = 0.02; // Reduced for softer return
	const FRICTION = 0.85; // Increased damping (lower value) to stop oscillation

	// State
	let mouseX = -1000;
	let mouseY = -1000;
	let width = 0;
	let height = 0;
	let dotColor = 'rgba(0, 0, 0, 0.15)'; // Default cache matches layout.css

	// Data structure: Simple TypedArrays would be fastest, but objects are cleaner to read.
	// For < 2000 points, objects are fine.
	type Point = {
		x: number;
		y: number;
		originX: number;
		originY: number;
		vx: number;
		vy: number;
	};

	let points: Point[] = [];
	let ctx: CanvasRenderingContext2D | null = null;
	let animationId: number;

	function initGrid() {
		if (!canvas) return;

		// Use canvas dimensions (which match parent due to CSS) instead of window

		width = canvas.width = canvas.offsetWidth;

		height = canvas.height = canvas.offsetHeight;

		// Add extra columns/rows to cover edges completely

		const cols = Math.ceil(width / GRID_SPACING) + 2;

		const rows = Math.ceil(height / GRID_SPACING) + 2;

		// Reset points

		points = new Array(cols * rows);

		let index = 0;

		for (let i = 0; i < cols; i++) {
			for (let j = 0; j < rows; j++) {
				const x = (i - 1) * GRID_SPACING; // Start slightly off-screen

				const y = (j - 1) * GRID_SPACING;

				points[index++] = {
					x,
					y,
					originX: x,
					originY: y,
					vx: 0,
					vy: 0
				};
			}
		}
	}

	function updateThemeColor() {
		if (typeof window === 'undefined') return;

		// Use computed body text color which ensures we get a resolved color value (rgb/hex)

		// rather than potentially getting the raw 'light-dark()' function string from a variable.

		const style = getComputedStyle(document.body);

		dotColor = style.color || '#000000';
	}

	function animate() {
		if (!ctx) return;

		// Clear
		ctx.clearRect(0, 0, width, height);
		ctx.globalAlpha = 0.15;
		ctx.fillStyle = dotColor;
		ctx.beginPath();

		for (let i = 0; i < points.length; i++) {
			const p = points[i];
			if (!p) continue;

			// 1. Calculate Distance to Mouse
			const dx = mouseX - p.x;
			const dy = mouseY - p.y;
			const distSq = dx * dx + dy * dy; // Avoid sqrt for check if possible

			// 2. Mouse Repulsion (only if close)
			if (distSq < MOUSE_RADIUS * MOUSE_RADIUS) {
				const dist = Math.sqrt(distSq);
				const angle = Math.atan2(dy, dx);
				const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
				const push = -force * PUSH_FORCE;

				p.vx += Math.cos(angle) * push;
				p.vy += Math.sin(angle) * push;
			}

			// 3. Spring back to origin
			const ex = p.originX - p.x;
			const ey = p.originY - p.y;

			p.vx += ex * SPRING_STIFFNESS;
			p.vy += ey * SPRING_STIFFNESS;

			// 4. Apply Friction
			p.vx *= FRICTION;
			p.vy *= FRICTION;

			// 5. Update Position
			p.x += p.vx;
			p.y += p.vy;

			// 6. Draw (Batch path)
			ctx.moveTo(p.x + DOT_RADIUS, p.y);
			ctx.arc(p.x, p.y, DOT_RADIUS, 0, Math.PI * 2);
		}

		ctx.fill();
		animationId = requestAnimationFrame(animate);
	}

	function handleResize() {
		initGrid();
		updateThemeColor();
	}

	function handleMouseMove(e: MouseEvent) {
		if (!canvas) return;
		const rect = canvas.getBoundingClientRect();
		mouseX = e.clientX - rect.left;
		mouseY = e.clientY - rect.top;
	}

	function handleMouseLeave() {
		mouseX = -1000;
		mouseY = -1000;
	}

	onMount(() => {
		if (!canvas) return;
		ctx = canvas.getContext('2d', { alpha: true });

		handleResize();

		// Observer for Dark Mode changes to update color instantly
		const observer = new MutationObserver(updateThemeColor);
		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['class', 'data-theme']
		});

		animationId = requestAnimationFrame(animate);
		window.addEventListener('resize', handleResize);
		window.addEventListener('mousemove', handleMouseMove);
		window.addEventListener('mouseout', handleMouseLeave);

		return () => {
			window.removeEventListener('resize', handleResize);
			window.removeEventListener('mousemove', handleMouseMove);
			window.removeEventListener('mouseout', handleMouseLeave);
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
