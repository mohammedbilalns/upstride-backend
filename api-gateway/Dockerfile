# -----------------------
# 1. Build Stage
FROM node:24-alpine AS builder

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

COPY package*.json ./

RUN pnpm install

COPY tsconfig.json ./
COPY src ./src

RUN pnpm run build



# -----------------------
# 2. Production Stage

FROM node:24-alpine AS production

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

COPY --from=builder /app/node_modules ./node_modules

COPY --from=builder /app/dist ./dist

COPY package*.json ./

EXPOSE 3000

CMD ["pnpm", "run", "start"]

