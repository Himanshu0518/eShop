FROM node:22-alpine

WORKDIR /app

# copy everything (schema included)
COPY . .

# install deps (no prisma generate here)
RUN npm install --omit=dev

EXPOSE 8000

# prisma generate + app start at RUNTIME
CMD ["sh", "-c", "npx prisma generate && node dist/index.js"]
