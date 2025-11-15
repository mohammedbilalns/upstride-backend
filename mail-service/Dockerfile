# ---- Build Stage ----
FROM oven/bun:latest AS builder

WORKDIR /app

# Copy package files for caching
COPY package.json bun.lockb* ./

# Install dependencies
RUN bun install

# Copy source files
COPY . .

# Build TypeScript -> dist/
RUN bun run build


# ---- Production Stage ----
FROM oven/bun:slim

WORKDIR /app

# Copy only required artifacts
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules


# Start application
CMD ["bun", "dist/server.js"]

