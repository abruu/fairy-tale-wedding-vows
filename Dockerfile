# ---------- BUILD STAGE ----------
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build


# ---------- PRODUCTION STAGE ----------
FROM node:20-alpine

WORKDIR /app

# ✅ install correct static server
RUN npm install -g serve

# copy build output
COPY --from=builder /app/dist ./dist

EXPOSE 3100

# ✅ correct command
CMD ["serve", "-s", "dist", "-l", "3100"]