FROM node:22

WORKDIR /app

# 1. Copy package files first (for caching)
COPY package.json pnpm-lock.yaml ./

# 2. Copy prisma folder and schema so postinstall works
COPY prisma ./prisma

# 3. Install dependencies
RUN npm install -g pnpm && pnpm install --prod

# 4. Copy the rest of the project
COPY . .

# 5. Expose port and start server
EXPOSE 8000
CMD ["node", "dist/index.js"]
