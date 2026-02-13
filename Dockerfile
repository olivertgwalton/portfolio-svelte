# syntax=docker/dockerfile:1

# --- Stage 1: Rust/WASM Builder ---
# Using 'slim' for a smaller footprint on your SD card
FROM rust:slim AS wasm-builder
WORKDIR /app

# Install wasm-pack and essential build tools
RUN apt-get update && apt-get install -y curl pkg-config libssl-dev && \
    curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh

# Copy Rust source code
COPY rust-grid ./rust-grid

# Build WASM with SIMD for the Pi 5's ARMv8 architecture
# We use a cache mount to speed up subsequent builds on your SD card
RUN --mount=type=cache,target=/usr/local/cargo/registry \
    cd rust-grid && RUSTFLAGS='-C target-feature=+simd128' wasm-pack build --target web --out-dir ../src/lib/wasm

# --- Stage 2: SvelteKit/Bun Builder ---
# Using 'oven/bun' (the official tag for the latest stable v1.x)
FROM oven/bun AS builder
WORKDIR /app

# Copy dependency files first for better caching
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Bring in the WASM artifacts from the Rust stage
COPY --from=wasm-builder /app/src/lib/wasm ./src/lib/wasm

# Copy the rest of the project
COPY . .

# Move WASM to static for the production build
RUN mkdir -p static/wasm && \
    mv src/lib/wasm/rust_grid_bg.wasm static/wasm/

# Build the SvelteKit app (ensure you have adapter-bun configured)
ENV NODE_ENV=production
RUN bun run build

# --- Stage 3: Production Runner ---
# Final minimal image
FROM oven/bun:slim AS release
WORKDIR /app

# Copy only production build artifacts
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/static ./static

# Security: Run as the built-in 'bun' user
USER bun
EXPOSE 3000/tcp

ENV NODE_ENV=production
ENV PORT=3000

# Start the SvelteKit server
ENTRYPOINT [ "bun", "run", "build/index.js" ]
