<script lang="ts">
	import { onMount } from 'svelte';
	import type * as WasmGrid from '../../wasm/rust_grid.js';

	// Svelte 5 Runes for element binding
	let canvas = $state<HTMLCanvasElement>();

	let { fixed = false, spacing = 40 } = $props<{
		fixed?: boolean;
		spacing?: number;
	}>();

	// Config
	const BASE_DOT_RADIUS = 1.5;

	// State
	let mouseX = -1000;
	let mouseY = -1000;
	let width = 0;
	let height = 0;
	let dpr = 1;
	let dotColor = $state('rgb(0, 0, 0)');
	// Buffers
	let posX: Float32Array; // Rust View X
	let posY: Float32Array; // Rust View Y

	// Internal
	let numPoints = $state(0);
	let ctx: CanvasRenderingContext2D | null = null;
	let animationId: number;

	// WASM
	let wasmGlue: typeof WasmGrid;
	let wasmMemory: WebAssembly.Memory;
	let engine: WasmGrid.GridEngine | undefined;

	function updateThemeColor() {
		if (typeof window === 'undefined') return;
		const style = getComputedStyle(document.body);
		let color = style.color || 'rgb(0, 0, 0)';

		if (color.includes('rgba') || color.includes('hsla')) {
			color = color
				.replace(/rgba?\(/, 'rgb(')
				.replace(/hsla?\(/, 'hsl(')
				.replace(/[,/]\s*[\d.]+\)$/, ')');
		}

		if (color.includes('0, 0, 0') || color === 'black' || color === 'rgb(0, 0, 0)') {
			dotColor = 'rgb(255, 255, 255)';
		} else {
			dotColor = color;
		}
	}

	async function initWasm() {
		try {
			if (!wasmGlue) {
				// With target: web, we import the default as an initializer
				// and the wasm file as a URL.
				const wasmPkg = await import('../../wasm/rust_grid.js');

				// Initialize with path to static asset

				const wasmExports = await wasmPkg.default('/wasm/rust_grid_bg.wasm');

				wasmGlue = wasmPkg;
				wasmMemory = wasmExports.memory;
			}
		} catch {
			console.error('WASM Init Failed');
		}
	}
	async function initData() {
		if (!canvas) return;

		dpr = window.devicePixelRatio || 1;
		const rect = canvas.getBoundingClientRect();
		width = rect.width;
		height = rect.height;

		// Ensure integer dimensions for pixel-perfect rendering
		const displayWidth = Math.ceil(width * dpr);
		const displayHeight = Math.ceil(height * dpr);

		canvas.width = displayWidth;
		canvas.height = displayHeight;

		// Work in physical pixels
		if (ctx) ctx.setTransform(1, 0, 0, 1, 0, 0);

		await initGrid();
	}

	async function initGrid() {
		await initWasm();
		if (!wasmGlue || !wasmMemory) return;

		const cols = Math.ceil(width / spacing) + 2;
		const rows = Math.ceil(height / spacing) + 2;
		numPoints = cols * rows;

		if (engine) {
			try {
				engine.free();
			} catch {
				/* ignore */
			}
			engine = undefined;
		}

		engine = new wasmGlue.GridEngine(numPoints);
		engine.init(width, height, spacing, dpr);

		posX = new Float32Array(wasmMemory.buffer, engine.pos_x_ptr(), numPoints);
		posY = new Float32Array(wasmMemory.buffer, engine.pos_y_ptr(), numPoints);
	}

	function animate() {
		animationId = requestAnimationFrame(animate);

		if (!ctx || !canvas) return;

		// Ensure identity transform for physical pixel drawing
		ctx.setTransform(1, 0, 0, 1, 0, 0);

		ctx.clearRect(0, 0, canvas.width, canvas.height);
		renderGrid();
	}

	function renderGrid() {
		if (!engine || !posX || !posY) return;

		engine.update(mouseX, mouseY, dpr, 0.02, 0.85);

		ctx!.fillStyle = dotColor;
		ctx!.globalAlpha = 0.15;
		ctx!.beginPath();
		const dotRadius = BASE_DOT_RADIUS * dpr;
		for (let i = 0; i < numPoints; i++) {
			ctx!.moveTo(posX[i] + dotRadius, posY[i]);
			ctx!.arc(posX[i], posY[i], dotRadius, 0, Math.PI * 2);
		}
		ctx!.fill();
	}

	// Interaction
	function handleMouseMove(e: MouseEvent) {
		// Track mouse globally for background interaction
		const rect = canvas?.getBoundingClientRect();
		if (!rect) return;
		mouseX = (e.clientX - rect.left) * dpr;
		mouseY = (e.clientY - rect.top) * dpr;
	}

	onMount(() => {
		if (!canvas) return;
		ctx = canvas.getContext('2d', { alpha: true });

		initData();
		updateThemeColor();

		window.addEventListener('resize', () => {
			initData();
			updateThemeColor();
		});
		const observer = new MutationObserver(updateThemeColor);
		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['class', 'data-theme']
		});

		animationId = requestAnimationFrame(animate);

		return () => {
			cancelAnimationFrame(animationId);
			observer.disconnect();
		};
	});
</script>

<svelte:window onmousemove={handleMouseMove} />

<div class="contents">
	<canvas
		bind:this={canvas}
		class="pointer-events-none inset-0 z-0 h-full w-full {fixed ? 'fixed' : 'absolute'}"
	></canvas>
</div>
