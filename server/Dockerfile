FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm && pnpm install --prod

COPY . .

RUN pnpm build

EXPOSE 8000

CMD ["sh", "-c", "npx prisma generate && node dist/index.js"]
