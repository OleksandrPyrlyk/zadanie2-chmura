# Zadanie 1 — Programowanie Aplikacji w Chmurze Obliczeniowej

## Autor

Oleksandr Pyrlyk

## Część obowiązkowa

---

## Zadanie 1 — Aplikacja pogodowa

W ramach zadania została przygotowana aplikacja webowa w języku JavaScript z wykorzystaniem Node.js oraz Express.

Aplikacja po uruchomieniu zapisuje w logach:
- datę uruchomienia,
- imię i nazwisko autora,
- port TCP, na którym nasłuchuje aplikacja.

Aplikacja umożliwia wybór kraju oraz miasta z predefiniowanej listy i pokazuje dane pogodowe dla wybranej lokalizacji.

### Uruchomienie aplikacji lokalnie

npm install  
npm start  

Adres aplikacji:

http://localhost:8080

---

## Zadanie 2 — Dockerfile

Do uruchomienia aplikacji w kontenerze został przygotowany plik Dockerfile.

Plik zawiera:
- obraz bazowy Node.js Alpine,
- informację o autorze zgodną ze standardem OCI,
- kopiowanie plików aplikacji,
- instalację zależności,
- wystawienie portu 8080,
- healthcheck,
- komendę uruchamiającą aplikację.

---

## Plik .dockerignore

Plik został użyty do wykluczenia zbędnych plików z procesu budowania obrazu, takich jak:
- node_modules
- pliki git
- pliki tymczasowe

---

## Zadanie 3 — Polecenia Docker

### a. Zbudowanie obrazu kontenera

docker build -t zadanie1-weather .

### b. Uruchomienie kontenera

docker run -d -p 8080:8080 --name zadanie1-container zadanie1-weather

### c. Odczytanie logów aplikacji

docker logs zadanie1-container

Logi zawierają:
- datę uruchomienia aplikacji,
- autora,
- port TCP.

### d. Sprawdzenie rozmiaru obrazu

docker images zadanie1-weather

### e. Sprawdzenie liczby warstw obrazu

docker history zadanie1-weather

---

## Sprawdzenie działania aplikacji

Po uruchomieniu kontenera aplikacja jest dostępna pod adresem:

http://localhost:8080

Użytkownik może wybrać kraj i miasto oraz sprawdzić dane pogodowe.

---

## Zrzut ekranu działającej aplikacji w przeglądarce
<img width="820" height="659" alt="image" src="https://github.com/user-attachments/assets/69d75269-98ac-40dd-aebe-9cf97f99d810" />

