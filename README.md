# portfolio

Personal portfolio and blog, built with [SvelteKit](https://svelte.dev/docs/kit) and served by
[Bun](https://bun.com/).

## Stack

| | |
|---|---|
| Runtime | Bun (via [`svelte-adapter-bun`](https://github.com/gornostay25/svelte-adapter-bun)) |
| Framework | SvelteKit 2 · Svelte 5 (runes) |
| Build | Vite 8 (Rolldown) |
| Styling | Tailwind CSS 4 · [Skeleton](https://skeleton.dev) 5 |
| Content | mdsvex · Shiki · KaTeX |
| Lint & format | [Biome](https://biomejs.dev) |
| Tests | Playwright (e2e, a11y, visual, Lighthouse) |
| Native | Rust → WebAssembly (`rust-grid`) |

## Developing

```sh
bun install
bun run dev
```

## Commands

| Command | Description |
|---|---|
| `bun run dev` | Start the dev server |
| `bun run build` | Production build |
| `bun run preview` | Preview the production build |
| `bun run start` | Serve the built app with Bun |
| `bun run lint` | Biome format + lint check |
| `bun run format` | Apply Biome formatting |
| `bun run check` | `svelte-check` type checking |
| `bun run test:e2e` | Playwright end-to-end tests |
| `bun run test:e2e:ui` | Playwright in UI mode |
| `bun run test:e2e:perf` | Lighthouse performance project |
| `bun run test:e2e:update-snapshots` | Refresh visual snapshots |
| `bun run build:wasm` | Rebuild the Rust/WASM grid module |

## WebAssembly

The animated grid is a Rust crate in `rust-grid/`, compiled to WASM with SIMD enabled. It is
committed as a build artifact, so you only need `bun run build:wasm` (which requires
[`wasm-pack`](https://rustwasm.github.io/wasm-pack/)) after changing the Rust source.

## Deployment

Two supported targets, both running Bun:

- **Vercel** — configured by `vercel.json`.
- **Docker** — multi-stage `Dockerfile` that builds the WASM module, builds the site, then
  installs production dependencies only. Listens on port 3000.

`docker-compose.yml` consumes a prebuilt image rather than building one, so build it first:

```sh
docker build -t portfolio .
```

```sh
docker compose up -d
```
