FROM node:20-slim
WORKDIR /app

COPY package.json ./

RUN npm install -g pnpm && pnpm install

COPY . .
RUN pnpm build
EXPOSE 4173

CMD ["pnpm", "start", "--host", "0.0.0.0"]
