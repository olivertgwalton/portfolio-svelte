// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

// Kit 3 no longer generates .svelte-kit/ambient.d.ts, which is what used to pull
// in the `declare module '*?enhanced'` declaration. Reference it directly.
/// <reference types="@sveltejs/enhanced-img" />

declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
