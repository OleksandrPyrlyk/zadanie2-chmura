# syntax=docker/dockerfile:1

FROM node:20-alpine AS dependencies

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev && npm cache clean --force


FROM node:20-alpine

LABEL org.opencontainers.image.authors="Oleksandr Pyrlyk"
LABEL org.opencontainers.image.title="Aplikacja pogodowa - Zadanie 1"
LABEL org.opencontainers.image.description="Aplikacja pogodowa Node.js uruchamiana w kontenerze Docker"

ENV NODE_ENV=production
ENV PORT=8080

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY package*.json ./
COPY server.js ./
COPY public ./public

EXPOSE 8080

USER node

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:8080 || exit 1

CMD ["node", "server.js"]