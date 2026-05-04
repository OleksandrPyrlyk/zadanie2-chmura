# syntax=docker/dockerfile:1.7

FROM node:20-alpine AS source

ARG GITHUB_REPO

WORKDIR /src

RUN apk add --no-cache git

RUN --mount=type=secret,id=github_token \
    echo "BuildKit secret został zamontowany poprawnie" && \
    git clone ${GITHUB_REPO} app


FROM node:20-alpine AS dependencies

WORKDIR /app

COPY --from=source /src/app/package*.json ./

RUN npm install --omit=dev && npm cache clean --force


FROM node:20-alpine

LABEL org.opencontainers.image.authors="Oleksandr Pyrlyk"
LABEL org.opencontainers.image.title="Aplikacja pogodowa - Zadanie 1"
LABEL org.opencontainers.image.description="Multi-platform image built with BuildKit, registry cache and secret mount"
LABEL org.opencontainers.image.source="https://github.com/OleksandrPyrlyk/zadanie1-chmura"

ENV NODE_ENV=production
ENV PORT=8080

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=source /src/app/package*.json ./
COPY --from=source /src/app/server.js ./
COPY --from=source /src/app/public ./public

EXPOSE 8080

USER node

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:8080 || exit 1

CMD ["node", "server.js"]