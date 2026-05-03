# Etap 1: obraz bazowy z Node.js
FROM node:20-alpine

# Informacja o autorze zgodna ze standardem OCI
LABEL org.opencontainers.image.authors="Oleksandr Pyrlyk"
LABEL org.opencontainers.image.title="Aplikacja pogodowa - Zadanie 1"
LABEL org.opencontainers.image.description="Aplikacja Node.js pokazująca pogodę dla wybranego kraju i miasta"

# Katalog roboczy w kontenerze
WORKDIR /app

# Kopiowanie plików zależności
COPY package*.json ./

# Instalacja zależności
RUN npm install --omit=dev

# Kopiowanie kodu aplikacji
COPY server.js ./
COPY public ./public

# Port TCP, na którym aplikacja nasłuchuje
EXPOSE 8080

# Healthcheck sprawdzający działanie aplikacji
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:8080 || exit 1

# Uruchomienie aplikacji
CMD ["npm", "start"]