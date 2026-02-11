// Physics Worker
// Handles the JS calculation off the main thread

// Fast Math Helpers matching Rust implementation
const PI = Math.PI;
const TWO_PI = 2.0 * PI;
const INV_TWO_PI = 0.159154943;
const B = 1.27323954;
const C = -0.405284735;

function fastSin(x) {
	let q = x * INV_TWO_PI;
	q = q - Math.floor(q + 0.5);
	x = q * TWO_PI;
	return B * x + C * x * Math.abs(x);
}

function fastCos(x) {
	return fastSin(x + PI / 2.0);
}

self.onmessage = (e) => {
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

	// Pre-calc constants to help JIT
	const wa1 = WAVE_AMP / 1.0;
	const wf1 = WAVE_FREQ * 1.0;
	const ts1 = TWIST_SPEED * 1.0;
	const wa2 = WAVE_AMP / 2.0;
	const wf2 = WAVE_FREQ * 2.0;
	const ts2 = TWIST_SPEED * 2.0;
	const wa3 = WAVE_AMP / 3.0;
	const wf3 = WAVE_FREQ * 3.0;
	const ts3 = TWIST_SPEED * 3.0;
	const wa4 = WAVE_AMP / 4.0;
	const wf4 = WAVE_FREQ * 4.0;
	const ts4 = TWIST_SPEED * 4.0;
	const wa5 = WAVE_AMP / 5.0;
	const wf5 = WAVE_FREQ * 5.0;
	const ts5 = TWIST_SPEED * 5.0;
	const wa6 = WAVE_AMP / 6.0;
	const wf6 = WAVE_FREQ * 6.0;
	const ts6 = TWIST_SPEED * 6.0;
	const wa7 = WAVE_AMP / 7.0;
	const wf7 = WAVE_FREQ * 7.0;
	const ts7 = TWIST_SPEED * 7.0;
	const wa8 = WAVE_AMP / 8.0;
	const wf8 = WAVE_FREQ * 8.0;
	const ts8 = TWIST_SPEED * 8.0;
	const wa9 = WAVE_AMP / 9.0;
	const wf9 = WAVE_FREQ * 9.0;
	const ts9 = TWIST_SPEED * 9.0;
	const wa10 = WAVE_AMP / 10.0;
	const wf10 = WAVE_FREQ * 10.0;
	const ts10 = TWIST_SPEED * 10.0;
	const wa11 = WAVE_AMP / 11.0;
	const wf11 = WAVE_FREQ * 11.0;
	const ts11 = TWIST_SPEED * 11.0;
	const wa12 = WAVE_AMP / 12.0;
	const wf12 = WAVE_FREQ * 12.0;
	const ts12 = TWIST_SPEED * 12.0;
	const wa13 = WAVE_AMP / 13.0;
	const wf13 = WAVE_FREQ * 13.0;
	const ts13 = TWIST_SPEED * 13.0;
	const wa14 = WAVE_AMP / 14.0;
	const wf14 = WAVE_FREQ * 14.0;
	const ts14 = TWIST_SPEED * 14.0;
	const wa15 = WAVE_AMP / 15.0;
	const wf15 = WAVE_FREQ * 15.0;
	const ts15 = TWIST_SPEED * 15.0;
	const wa16 = WAVE_AMP / 16.0;
	const wf16 = WAVE_FREQ * 16.0;
	const ts16 = TWIST_SPEED * 16.0;

	for (let i = 0; i < numPoints; i++) {
		const idx = i * 4;

		// Read base state
		const baseAngle = particles[idx + 2];
		const baseRadius = particles[idx + 3];

		// 1. Rotation
		const angle = baseAngle + time * SPEED * (1000.0 / baseRadius);

		// 2. "Fur" wave effect (Unrolled for optimization)
		let waveOffset = 0.0;

		// Octave 1
		let phase = baseAngle * wf1 - time * ts1;
		waveOffset += fastSin(phase) * wa1;

		// Octave 2
		phase = baseAngle * wf2 - time * ts2;
		waveOffset += fastSin(phase) * wa2;

		// Octave 3
		phase = baseAngle * wf3 - time * ts3;
		waveOffset += fastSin(phase) * wa3;

		// Octave 4
		phase = baseAngle * wf4 - time * ts4;
		waveOffset += fastSin(phase) * wa4;

		// Octave 5
		phase = baseAngle * wf5 - time * ts5;
		waveOffset += fastSin(phase) * wa5;

		// Octave 6
		phase = baseAngle * wf6 - time * ts6;
		waveOffset += fastSin(phase) * wa6;

		// Octave 7
		phase = baseAngle * wf7 - time * ts7;
		waveOffset += fastSin(phase) * wa7;

		// Octave 8
		phase = baseAngle * wf8 - time * ts8;
		waveOffset += fastSin(phase) * wa8;

		// Octave 9
		phase = baseAngle * wf9 - time * ts9;
		waveOffset += fastSin(phase) * wa9;

		// Octave 10
		phase = baseAngle * wf10 - time * ts10;
		waveOffset += fastSin(phase) * wa10;

		// Octave 11
		phase = baseAngle * wf11 - time * ts11;
		waveOffset += fastSin(phase) * wa11;

		// Octave 12
		phase = baseAngle * wf12 - time * ts12;
		waveOffset += fastSin(phase) * wa12;

		// Octave 13
		phase = baseAngle * wf13 - time * ts13;
		waveOffset += fastSin(phase) * wa13;

		// Octave 14
		phase = baseAngle * wf14 - time * ts14;
		waveOffset += fastSin(phase) * wa14;

		// Octave 15
		phase = baseAngle * wf15 - time * ts15;
		waveOffset += fastSin(phase) * wa15;

		// Octave 16
		phase = baseAngle * wf16 - time * ts16;
		waveOffset += fastSin(phase) * wa16;

		const r = baseRadius + waveOffset;

		// 3. Polar to Cartesian
		const x = centerX + r * fastCos(angle);
		const y = centerY + r * fastSin(angle);

		// Write back position
		particles[idx] = x;
		particles[idx + 1] = y;
	}

	const duration = performance.now() - start;
	self.postMessage({ particles, duration }, [particles.buffer]);
};
