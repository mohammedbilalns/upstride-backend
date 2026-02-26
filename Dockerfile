# -----------------------
# 1. Build Stage
FROM node:24-alpine AS builder

WORKDIR /app

RUN corepack enable 

COPY package*.json pnpm-lock.yaml .npmrc* ./

RUN pnpm install --frozen-lockfile

COPY tsconfig.json ./
COPY src ./src

RUN pnpm run build



# -----------------------
# 2. Production Stage

FROM node:24-alpine AS production

WORKDIR /app


ENV NODE_ENV=production

RUN corepack enable 

# Create a non-root user and group 
RUN addgroup -S app && adduser -S app -G app

# Copy dependency manifests
COPY --chown=app:app package.json pnpm-lock.yaml ./

# Install ONLY production dependencies
# --ignore-scripts: Skips git hooks/husky setup
# --prod: Excludes devDependencies (TypeScript, ESLint, etc.)
RUN pnpm install --prod --frozen-lockfile --ignore-scripts

# ensure the user owns the dist files
COPY --chown=app:app --from=builder /app/dist ./dist

# Switch to the non-root user
USER app

EXPOSE 3001

CMD ["pnpm", "run", "start"]


