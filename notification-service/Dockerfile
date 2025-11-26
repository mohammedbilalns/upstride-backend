FROM oven/bun:1-alpine

WORKDIR /app

COPY package.json  ./

RUN bun install --frozen-lockfile

COPY tsconfig.json ./
COPY src ./src

RUN bun run build

COPY . .

EXPOSE 3005

CMD ["bun", "run", "start"]
