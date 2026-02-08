# Use the official Bun image
FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies into temp directory
# This will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lock /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# Install production dependencies
RUN mkdir -p /temp/prod
COPY package.json bun.lock /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# Build the project
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# Set environment variables for build time (e.g. PUBLIC_ vars needed for client bundle)
# Note: These are defaults, override in docker-compose or build args if needed
ENV NODE_ENV=production
# Run build
RUN bun run build

# Final production image
FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /app/build build
COPY --from=prerelease /app/package.json .

# Copy static assets or other necessary files if not included in build
# COPY --from=prerelease /app/static static 
# (SvelteKit adapter-bun usually bundles assets, but static folder might need explicit copy depending on config.
# Adapter-bun copies static assets to build/client usually.)

# Expose port
EXPOSE 3000

# Set production environment
ENV NODE_ENV=production
ENV PORT=3000

# Start the server
CMD ["bun", "run", "build/index.js"]
