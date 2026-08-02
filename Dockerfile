# syntax=docker/dockerfile:1

# --- Stage 1: SvelteKit/Bun Builder ---
# The Rust grid module is committed as a prebuilt artifact (src/lib/wasm and
# static/wasm), same as local dev and Vercel consume it. Rebuild it deliberately
# with `bun run build:wasm` rather than from inside the image, so every target
# ships the same binary and its matching wasm-bindgen glue.
FROM oven/bun AS builder
WORKDIR /app

# Dependency files first so this layer caches until the manifest changes
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .

ENV NODE_ENV=production
RUN bun run build

# --- Stage 2: Production Runner ---
FROM oven/bun:slim AS release
WORKDIR /app

# Stages don't share a filesystem, so the runtime deps are installed fresh here
# rather than inherited from the builder. --production keeps the dev toolchain out.
COPY --from=builder /app/package.json /app/bun.lock ./
RUN bun install --production --frozen-lockfile

COPY --from=builder /app/build ./build
COPY --from=builder /app/static ./static

# Security: Run as the built-in 'bun' user
USER bun
EXPOSE 3000/tcp

ENV NODE_ENV=production
ENV PORT=3000

ENTRYPOINT ["bun", "run", "build/index.js"]
