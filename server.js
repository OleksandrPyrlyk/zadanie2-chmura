const express = require("express");

const app = express();
const PORT = process.env.PORT || 8080;

// Autor programu
const AUTHOR = "Oleksandr Pyrlyk";

// Dane pogodowe - przykładowa predefiniowana lista
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