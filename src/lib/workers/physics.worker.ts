// Physics Worker
// Handles the JS calculation off the main thread

// Fast Math Helpers matching Rust implementation
const PI = Math.PI;
const TWO_PI = 2.0 * PI;
const INV_TWO_PI = 0.159154943;
const B = 1.27323954;
const C = -0.405284735;

function fastSin(x: number): number {
	let q = x * INV_TWO_PI;
	q = q - Math.floor(q + 0.5);
	x = q * TWO_PI;
	return B * x + C * x * Math.abs(x);
}

function fastCos(x: number): number {
	return fastSin(x + PI / 2.0);
}

export interface PhysicsWorkerRequest {
	particles: Float32Array;
	width: number;
	height: number;
	time: number;
}

export interface PhysicsWorkerResponse {
	particles: Float32Array;
	duration: number;
}

self.onmessage = (e: MessageEvent<PhysicsWorkerRequest>) => {
	const { particles, width, height, time } = e.data;

	// Constants matching Rust BenchmarkEngine
	const SPEED = 0.0002;
	const TWIST_SPEED = 0.005;
	const WAVE_FREQ = 5.0;
	const WAVE_AMP = 10.0;

	const centerX = width * 0.5;
	const centerY = height * 0.5;

	const numPoints = particles.length / 4; // x, y, angle, radius

	const start = performance.now();

	for (let i = 0; i < numPoints; i++) {
		const idx = i * 4;

		// Read base state
		const baseAngle = particles[idx + 2];
		const baseRadius = particles[idx + 3];

		// 1. Rotation
		const angle = baseAngle + time * SPEED * (1000.0 / baseRadius);

		// 2. "Fur" wave effect: 16 octaves
		let waveOffset = 0.0;
		for (let k = 1; k <= 16; k++) {
			waveOffset +=
				fastSin(baseAngle * WAVE_FREQ * k - time * TWIST_SPEED * k) *
				(WAVE_AMP / k);
		}

		const r = baseRadius + waveOffset;

		// 3. Polar to Cartesian
		const x = centerX + r * fastCos(angle);
		const y = centerY + r * fastSin(angle);

		// Write back position
		particles[idx] = x;
		particles[idx + 1] = y;
	}

	const duration = performance.now() - start;
	const response: PhysicsWorkerResponse = { particles, duration };
	self.postMessage(response, { transfer: [particles.buffer] });
};
