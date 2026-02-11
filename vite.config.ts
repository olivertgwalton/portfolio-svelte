import tailwindcss from '@tailwindcss/vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';

export default defineConfig({
	plugins: [tailwindcss(), enhancedImages(), sveltekit(), wasm(), topLevelAwait()],
	preview: {
		allowedHosts: ['oliverwalton.uk']
	}
});
