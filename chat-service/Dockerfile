# ---- Build Stage ----
FROM oven/bun:latest AS builder

WORKDIR /app

# Copy package files for caching
COPY package.json bun.lockb* ./

# Install dependencies
RUN bun install

COPY . .

RUN bun run build

# ---- Production Stage ----
FROM oven/bun:slim

WORKDIR /app

# Copy only what the prod app needs
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3003

CMD ["bun", "dist/server.js"]

