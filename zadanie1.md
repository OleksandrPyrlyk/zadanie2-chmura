# Zadanie 1 — Programowanie Aplikacji w Chmurze Obliczeniowej

## Autor

Oleksandr Nazwisko

## Część obowiązkowa

---

## Zadanie 1 — Aplikacja pogodowa

W ramach zadania została przygotowana aplikacja webowa w języku JavaScript z wykorzystaniem Node.js oraz Express.

Aplikacja po uruchomieniu zapisuje w logach:
- datę uruchomienia,
- imię i nazwisko autora,
- port TCP, na którym nasłuchuje aplikacja.

Aplikacja umożliwia wybór kraju oraz miasta z predefiniowanej listy i pokazuje przykładowe dane pogodowe dla wybranej lokalizacji.

### Uruchomienie aplikacji lokalnie

```bash
npm install
npm start
```

Adres aplikacji:

```text
http://localhost:8080
```

---

## Kod pliku `server.js`

```js
const express = require("express");

const app = express();
const PORT = process.env.PORT || 8080;

const AUTHOR = "Oleksandr Nazwisko";

const weatherData = {
    "Polska": {
        "Warszawa": {
            temperature: "18°C",
            description: "Zachmurzenie umiarkowane",
            humidity: "60%",
            wind: "12 km/h"
        },
        "Kraków": {
            temperature: "20°C",
            description: "Słonecznie",
            humidity: "55%",
            wind: "9 km/h"
        }
    },
    "Ukraina": {
        "Kijów": {
            temperature: "21°C",
            description: "Częściowe zachmurzenie",
            humidity: "58%",
            wind: "10 km/h"
        },
        "Lwów": {
            temperature: "17°C",
            description: "Lekki deszcz",
            humidity: "72%",
            wind: "14 km/h"
        }
    },
    "Niemcy": {
        "Berlin": {
            temperature: "19°C",
            description: "Pochmurno",
            humidity: "63%",
            wind: "11 km/h"
        },
        "Monachium": {
            temperature: "16°C",
            description: "Deszczowo",
            humidity: "78%",
            wind: "15 km/h"
        }
    }
};

app.use(express.static("public"));

app.get("/api/weather", (req, res) => {
    const country = req.query.country;
    const city = req.query.city;

    if (!country || !city) {
        return res.status(400).json({
            error: "Brak kraju lub miasta"
        });
    }

    const countryData = weatherData[country];

    if (!countryData || !countryData[city]) {
        return res.status(404).json({
            error: "Nie znaleziono danych pogodowych dla wybranej lokalizacji"
        });
    }

    res.json({
        country,
        city,
        weather: countryData[city]
    });
});

app.listen(PORT, () => {
    const startDate = new Date().toISOString();

    console.log("====================================");
    console.log(`Data uruchomienia aplikacji: ${startDate}`);
    console.log(`Autor programu: ${AUTHOR}`);
    console.log(`Aplikacja nasłuchuje na porcie TCP: ${PORT}`);
    console.log("====================================");
});
```

---

## Kod pliku `public/index.html`

```html
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Aplikacja pogodowa</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: #eef3f8;
            margin: 0;
            padding: 40px;
        }

        .container {
            max-width: 500px;
            margin: auto;
            background: white;
            padding: 25px;
            border-radius: 12px;
            box-shadow: 0 0 12px rgba(0,0,0,0.15);
        }

        h1 {
            text-align: center;
        }

        label {
            display: block;
            margin-top: 15px;
            font-weight: bold;
        }

        select, button {
            width: 100%;
            padding: 10px;
            margin-top: 8px;
            font-size: 16px;
        }

        button {
            background: #1976d2;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
        }

        button:hover {
            background: #125aa0;
        }

        .result {
            margin-top: 20px;
            padding: 15px;
            background: #f1f8ff;
            border-radius: 8px;
        }
    </style>
</head>
<body>

<div class="container">
    <h1>Pogoda</h1>

    <label for="country">Wybierz kraj:</label>
    <select id="country" onchange="updateCities()">
        <option value="Polska">Polska</option>
        <option value="Ukraina">Ukraina</option>
        <option value="Niemcy">Niemcy</option>
    </select>

    <label for="city">Wybierz miasto:</label>
    <select id="city"></select>

    <button onclick="getWeather()">Sprawdź pogodę</button>

    <div class="result" id="result">
        Wybierz kraj i miasto, a następnie kliknij przycisk.
    </div>
</div>

<script>
    const cities = {
        "Polska": ["Warszawa", "Kraków"],
        "Ukraina": ["Kijów", "Lwów"],
        "Niemcy": ["Berlin", "Monachium"]
    };

    function updateCities() {
        const country = document.getElementById("country").value;
        const citySelect = document.getElementById("city");

        citySelect.innerHTML = "";

        cities[country].forEach(city => {
            const option = document.createElement("option");
            option.value = city;
            option.textContent = city;
            citySelect.appendChild(option);
        });
    }

    async function getWeather() {
        const country = document.getElementById("country").value;
        const city = document.getElementById("city").value;

        const response = await fetch(`/api/weather?country=${country}&city=${city}`);
        const data = await response.json();

        if (data.error) {
            document.getElementById("result").innerHTML = data.error;
            return;
        }

        document.getElementById("result").innerHTML = `
            <h3>${data.city}, ${data.country}</h3>
            <p><b>Temperatura:</b> ${data.weather.temperature}</p>
            <p><b>Opis:</b> ${data.weather.description}</p>
            <p><b>Wilgotność:</b> ${data.weather.humidity}</p>
            <p><b>Wiatr:</b> ${data.weather.wind}</p>
        `;
    }

    updateCities();
</script>

</body>
</html>
```

---

## Zadanie 2 — Dockerfile

Do uruchomienia aplikacji w kontenerze został przygotowany plik `Dockerfile`.

Plik zawiera:
- obraz bazowy Node.js Alpine,
- informację o autorze zgodną ze standardem OCI,
- kopiowanie plików aplikacji,
- instalację zależności,
- wystawienie portu 8080,
- healthcheck,
- komendę uruchamiającą aplikację.

### Kod pliku `Dockerfile`

```dockerfile
FROM node:20-alpine

LABEL org.opencontainers.image.authors="Oleksandr Nazwisko"
LABEL org.opencontainers.image.title="Aplikacja pogodowa - Zadanie 1"
LABEL org.opencontainers.image.description="Aplikacja Node.js pokazująca pogodę dla wybranego kraju i miasta"

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

COPY server.js ./
COPY public ./public

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:8080 || exit 1

CMD ["npm", "start"]
```

---

## Plik `.dockerignore`

```text
node_modules
npm-debug.log
Dockerfile
.dockerignore
.git
.gitignore
README.md
zadanie1.md
```

---

## Zadanie 3 — Polecenia Docker

### a. Zbudowanie obrazu kontenera

```bash
docker build -t zadanie1-weather .
```

### b. Uruchomienie kontenera

```bash
docker run -d -p 8080:8080 --name zadanie1-container zadanie1-weather
```

### c. Odczytanie logów aplikacji

```bash
docker logs zadanie1-container
```

Przykładowy wynik:

```text
====================================
Data uruchomienia aplikacji: 2026-05-03T18:00:00.000Z
Autor programu: Oleksandr Nazwisko
Aplikacja nasłuchuje na porcie TCP: 8080
====================================
```

### d. Sprawdzenie rozmiaru obrazu

```bash
docker images zadanie1-weather
```

### e. Sprawdzenie liczby warstw obrazu

```bash
docker history zadanie1-weather
```

---

## Sprawdzenie działania aplikacji

Po uruchomieniu kontenera aplikacja jest dostępna pod adresem:

```text
http://localhost:8080
```

W przeglądarce należy wybrać kraj oraz miasto, a następnie kliknąć przycisk `Sprawdź pogodę`.

---

## Zrzut ekranu

W tym miejscu należy wkleić zrzut ekranu działającej aplikacji w przeglądarce.

```text
Miejsce na zrzut ekranu aplikacji
```