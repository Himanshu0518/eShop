# ---------- BUILD STAGE ----------
FROM node:22 AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma

RUN npm install -g pnpm && pnpm install

COPY . .

# Build TypeScript → dist
RUN pnpm build


# ---------- PRODUCTION STAGE ----------
FROM node:22

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma

RUN npm install -g pnpm && pnpm install --prod

# Copy only built output
COPY --from=builder /app/dist ./dist

EXPOSE 8000

CMD ["node", "dist/index.js"]
