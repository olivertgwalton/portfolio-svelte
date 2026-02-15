<script lang="ts">
	import { onMount } from "svelte";
	import type * as WasmGrid from "../../wasm/rust_grid.js";

	// Svelte 5 Runes
	let canvas = $state<HTMLCanvasElement>();

	// This component is dedicated to the benchmark visualization

	// State
	let width = 0;
	let height = 0;
	let dpr = 1;

	// Benchmark State
	let isPaused = $state(true);
	let activeEngine = $state<"rust" | "js">("rust");
	let particleCount = $state(100000);

	// Buffers
	let posX: Float32Array;
	let posY: Float32Array;
	let jsParticles: Float32Array;
	let workerParticles: Float32Array;

	// Rendering
	let imageData: ImageData;
	let pixelBuffer: Uint32Array;

	// Internal
	let ctx: CanvasRenderingContext2D | null = null;
	let animationId: number;
	let wasmGlue: typeof WasmGrid;
	let wasmMemory: WebAssembly.Memory;
	let engine: WasmGrid.BenchmarkEngine | undefined;
	let jsWorker: Worker | undefined;
	let jsWorkerBusy = false;

	// Metrics
	let frameTime = $state(0);
	let fps = $derived(frameTime > 0 ? 1000 / frameTime : 0);
	let metricsStart = 0;
	let metricsFrames = 0;
	let frameTimeAccum = 0;

	async function initWasm() {
		try {
			if (!wasmGlue) {
				const wasmPkg = await import("../../wasm/rust_grid.js");

				const wasmExports = await wasmPkg.default({
					module_or_path: "/wasm/rust_grid_bg.wasm",
				});
				wasmGlue = wasmPkg;
				wasmMemory = wasmExports.memory;
			}
		} catch {
			// Silently fail WASM init
		}
	}

	async function initData() {
		if (!canvas) return;

		dpr = window.devicePixelRatio || 1;
		const rect = canvas.getBoundingClientRect();
		width = rect.width;
		height = rect.height;

		const displayWidth = Math.ceil(width * dpr);
		const displayHeight = Math.ceil(height * dpr);

		canvas.width = displayWidth;
		canvas.height = displayHeight;

		if (ctx) ctx.setTransform(1, 0, 0, 1, 0, 0);

		if (ctx) {
			imageData = ctx.createImageData(displayWidth, displayHeight);
			pixelBuffer = new Uint32Array(imageData.data.buffer);
		}

		await initComparison();
	}

	async function initComparison() {
		if (jsWorker) {
			jsWorker.terminate();
			jsWorker = undefined;
			jsWorkerBusy = false;
		}

		await initWasm();
		if (!wasmGlue || !wasmMemory) return;

		if (engine) {
			try {
				engine.free();
			} catch {
				/* WASM object already freed */
			}
			engine = undefined;
		}

		engine = new wasmGlue.BenchmarkEngine(particleCount);
		engine.init(canvas!.width, canvas!.height);

		// Map Views
		posX = new Float32Array(
			wasmMemory.buffer,
			engine.pos_x_ptr(),
			particleCount,
		);
		posY = new Float32Array(
			wasmMemory.buffer,
			engine.pos_y_ptr(),
			particleCount,
		);

		// Setup JS
		jsParticles = new Float32Array(particleCount * 4);
		workerParticles = new Float32Array(particleCount * 4);

		const minDimension = Math.min(canvas!.width, canvas!.height);
		const min_r = minDimension * 0.15;
		const max_r = minDimension * 0.4;

		// Seed both engines with same data
		for (let i = 0; i < particleCount; i++) {
			const t = i / particleCount;
			const angle = t * Math.PI * 2 * 50;

			const r_t = (i % 100) / 100;
			const radius = min_r + (max_r - min_r) * r_t;

			const idx = i * 4;
			jsParticles[idx] = 0;
			jsParticles[idx + 1] = 0;
			jsParticles[idx + 2] = angle;
			jsParticles[idx + 3] = radius;

			workerParticles.set(jsParticles.subarray(idx, idx + 4), idx);
		}

		// Worker Setup
		const Worker = await import("../../workers/physics.worker.js?worker");
		jsWorker = new Worker.default();
		jsWorker.onmessage = (e) => {
			const { particles, duration } = e.data;
			workerParticles = particles;
			jsParticles.set(workerParticles);
			if (activeEngine === "js") frameTime = duration;
			jsWorkerBusy = false;
		};
	}

	function animate() {
		animationId = requestAnimationFrame(animate);

		if (!ctx || !canvas) return;
		ctx.setTransform(1, 0, 0, 1, 0, 0);

		const workStart = performance.now();
		renderComparison();
		const workTime = performance.now() - workStart;

		if (!isPaused) {
			// Update metrics every 500ms
			frameTimeAccum += workTime;
			metricsFrames++;
			const elapsed = performance.now() - metricsStart;
			if (elapsed >= 500) {
				frameTime = frameTimeAccum / metricsFrames;
				metricsStart = performance.now();
				metricsFrames = 0;
				frameTimeAccum = 0;
			}
		}
	}

	function renderComparison() {
		if (
			!engine ||
			!posX ||
			!posY ||
			!jsParticles ||
			!canvas ||
			!pixelBuffer
		)
			return;

		if (isPaused) return;

		const time = performance.now();
		const isRust = activeEngine === "rust";
		const w = canvas.width;
		const h = canvas.height;

		if (isRust) {
			engine.update(time, w, h);

			const renderPtr = engine.render();

			const pixelBytes = w * h * 4;

			if (
				renderPtr &&
				wasmMemory.buffer.byteLength >= renderPtr + pixelBytes
			) {
				const rustPixels = new Uint8ClampedArray(
					wasmMemory.buffer,
					renderPtr,
					pixelBytes,
				);
				const rustImageData = new ImageData(rustPixels, w, h);
				ctx!.putImageData(rustImageData, 0, 0);
			}
		} else {
			// JS Engine
			if (!jsWorkerBusy && jsWorker && workerParticles) {
				jsWorkerBusy = true;
				jsWorker.postMessage(
					{
						particles: workerParticles,
						width: w,
						height: h,
						time: time,
					},
					[workerParticles.buffer],
				);
			}

			const buffer = jsParticles;
			pixelBuffer.fill(0);
			const color = 0xff7171f8;

			for (let i = 0; i < particleCount; i++) {
				const x = buffer[i * 4];
				const y = buffer[i * 4 + 1];

				const ix = x | 0;
				const iy = y | 0;

				if (ix >= 0 && ix < w && iy >= 0 && iy < h) {
					pixelBuffer[iy * w + ix] = color;
				}
			}

			ctx!.putImageData(imageData, 0, 0);
		}
	}

	function resetMetrics() {
		metricsStart = performance.now();
		metricsFrames = 0;
		frameTimeAccum = 0;
		frameTime = 0;
	}

	function updateEngine(eng: "rust" | "js") {
		activeEngine = eng;
		resetMetrics();
	}

	function handleCountChange(e: Event) {
		const val = parseInt((e.target as HTMLInputElement).value);
		particleCount = val;
		initComparison();
	}

	function togglePause() {
		isPaused = !isPaused;
	}

	onMount(() => {
		if (!canvas) return;
		ctx = canvas.getContext("2d", { alpha: true });

		initData();

		window.addEventListener("resize", initData);

		metricsStart = performance.now();
		animationId = requestAnimationFrame(animate);

		return () => {
			cancelAnimationFrame(animationId);
			window.removeEventListener("resize", initData);
		};
	});
</script>

<div
	class="group relative my-8 h-150 w-full overflow-hidden rounded-xl border border-surface-200-800 bg-black font-sans"
>
	<canvas
		bind:this={canvas}
		class="absolute inset-0 h-full w-full cursor-crosshair"
	></canvas>

	<!-- Pause Button -->
	<button
		onclick={togglePause}
		class="absolute right-4 bottom-4 z-50 rounded-full border border-white/20 bg-black/50 p-2 text-white/50 backdrop-blur transition-all hover:bg-white/10 hover:text-white"
		aria-label={isPaused ? "Play Animation" : "Pause Animation"}
	>
		{#if isPaused}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="currentColor"><path d="M8 5v14l11-7z" /></svg
			>
		{:else}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="currentColor"
				><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg
			>
		{/if}
	</button>

	<!-- HUD -->
	<div class="pointer-events-none absolute top-6 left-6 space-y-1">
		<div class="flex items-baseline gap-2">
			<span
				class="text-4xl font-bold {activeEngine === 'rust'
					? 'text-green-500'
					: 'text-red-500'}"
			>
				{Math.round(fps)}
			</span>
			<span class="text-sm font-bold text-white/50">FPS</span>
		</div>
		<div class="font-mono text-xs text-white/40">
			Physics Time: {frameTime.toFixed(2)}ms
		</div>
		<div class="font-mono text-xs text-white/40">
			Particles: {(particleCount / 1000).toFixed(0)}k
		</div>
	</div>

	<!-- Controls -->
	<div
		class="pointer-events-auto absolute bottom-6 left-1/2 flex w-full max-w-md -translate-x-1/2 flex-col items-center gap-4 px-6"
	>
		<!-- Engine Toggle -->
		<div
			class="flex rounded-full border border-white/20 bg-black/80 p-1 backdrop-blur"
		>
			<button
				onclick={() => updateEngine("js")}
				class="rounded-full px-6 py-2 text-sm font-bold transition-all {activeEngine ===
				'js'
					? 'bg-red-500 text-white shadow-lg'
					: 'text-white/50 hover:text-white'}"
			>
				JavaScript
			</button>
			<button
				onclick={() => updateEngine("rust")}
				class="rounded-full px-6 py-2 text-sm font-bold transition-all {activeEngine ===
				'rust'
					? 'bg-green-500 text-white shadow-lg'
					: 'text-white/50 hover:text-white'}"
			>
				Rust / WASM
			</button>
		</div>

		<!-- Slider -->
		<div
			class="flex w-full items-center gap-4 rounded-xl border border-white/20 bg-black/50 px-4 py-2 backdrop-blur"
		>
			<span class="text-xs font-bold text-white/50">10k</span>
			<input
				type="range"
				min="10000"
				max="1000000"
				step="10000"
				value={particleCount}
				onchange={handleCountChange}
				class="h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-white/20 accent-white"
			/>
			<span class="text-xs font-bold text-white/50">1M</span>
		</div>
	</div>
</div>
