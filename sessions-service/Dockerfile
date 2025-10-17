FROM node:24-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY package*.json ./

RUN pnpm install

COPY tsconfig.json ./

COPY src ./src

RUN pnpm run build

COPY . .

EXPOSE 3006

CMD ["pnpm", "run", "start"]

