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
# adapter-static emits plain files, so there is no server to run and no runtime
# dependency to install — nginx just serves the directory. `static/` is already
# folded into `build/` by the adapter, so it needs no separate COPY.
FROM nginx:alpine AS release

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80/tcp
